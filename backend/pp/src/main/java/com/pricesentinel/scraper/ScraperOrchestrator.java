package com.pricesentinel.scraper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEventRepository;
import com.pricesentinel.diff.DiffEngine;
import com.pricesentinel.impact.ImpactScoringService;
import com.pricesentinel.llm.LlmExplanationService;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.plan.PlanNormalizer;
import com.pricesentinel.plan.PlanRepository;
import com.pricesentinel.snapshot.PricingSnapshot;
import com.pricesentinel.snapshot.PricingSnapshotRepository;
import com.pricesentinel.vendor.Monitor;
import com.pricesentinel.vendor.MonitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * Orchestrates the full scrape → diff → score → explain pipeline.
 *
 * <p>Lifecycle (TRD §6):
 * <ol>
 *   <li>Idempotency check — return existing in-flight ScrapeRun if monitor is already running.</li>
 *   <li>Create ScrapeRun(queued) → start Bright Data job → update to running.</li>
 *   <li>Poll loop with configurable maxAttempts + intervalMs.</li>
 *   <li>On success: interpret → persist raw payload → normalise plans →
 *       save PricingSnapshot + Plans → diff → score → LLM → save ChangeEvents.</li>
 *   <li>On failure: update ScrapeRun + Monitor status only; last good snapshot preserved.</li>
 * </ol>
 */
@Service
public class ScraperOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(ScraperOrchestrator.class);

    @Value("${scraper.poll.interval-ms:5000}")
    private long pollIntervalMs;

    @Value("${scraper.poll.max-attempts:20}")
    private int pollMaxAttempts;

    @Value("${scraper.retry.max-attempts:2}")
    private int retryMaxAttempts;

    private final BrightDataClient brightDataClient;
    private final SelfHealingInterpreter interpreter;
    private final ScrapeRunRepository scrapeRunRepository;
    private final RawPayloadRepository rawPayloadRepository;
    private final PricingSnapshotRepository snapshotRepository;
    private final PlanRepository planRepository;
    private final PlanNormalizer planNormalizer;
    private final MonitorRepository monitorRepository;
    private final DiffEngine diffEngine;
    private final ImpactScoringService impactScoringService;
    private final LlmExplanationService llmExplanationService;
    private final ChangeEventRepository changeEventRepository;
    private final ObjectMapper objectMapper;

    public ScraperOrchestrator(
            BrightDataClient brightDataClient,
            SelfHealingInterpreter interpreter,
            ScrapeRunRepository scrapeRunRepository,
            RawPayloadRepository rawPayloadRepository,
            PricingSnapshotRepository snapshotRepository,
            PlanRepository planRepository,
            PlanNormalizer planNormalizer,
            MonitorRepository monitorRepository,
            DiffEngine diffEngine,
            ImpactScoringService impactScoringService,
            LlmExplanationService llmExplanationService,
            ChangeEventRepository changeEventRepository,
            ObjectMapper objectMapper) {
        this.brightDataClient      = brightDataClient;
        this.interpreter           = interpreter;
        this.scrapeRunRepository   = scrapeRunRepository;
        this.rawPayloadRepository  = rawPayloadRepository;
        this.snapshotRepository    = snapshotRepository;
        this.planRepository        = planRepository;
        this.planNormalizer        = planNormalizer;
        this.monitorRepository     = monitorRepository;
        this.diffEngine            = diffEngine;
        this.impactScoringService  = impactScoringService;
        this.llmExplanationService = llmExplanationService;
        this.changeEventRepository = changeEventRepository;
        this.objectMapper          = objectMapper;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Triggers a new scrape run for the given vendor.
     * Idempotent: returns the existing in-flight run if monitor is already running.
     *
     * @return the ScrapeRun ID that was created or found
     */
    @Transactional
    public UUID triggerRun(UUID vendorId, String pricingUrl) {
        Monitor monitor = monitorRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new IllegalStateException("No monitor for vendor: " + vendorId));

        // Idempotency: if monitor is already running, return the existing run
        if (monitor.getStatus() == Monitor.MonitorStatus.running) {
            Optional<ScrapeRun> inFlight = scrapeRunRepository
                    .findFirstByMonitorIdAndStatusOrderByStartedAtDesc(
                            monitor.getId(), ScrapeRun.ScrapeRunStatus.running);
            if (inFlight.isPresent()) {
                log.info("Monitor already running for vendor={} — returning existing scrapeRunId={}",
                        vendorId, inFlight.get().getId());
                return inFlight.get().getId();
            }
        }

        // Create new ScrapeRun
        ScrapeRun run = new ScrapeRun();
        run.setMonitorId(monitor.getId());
        run.setStatus(ScrapeRun.ScrapeRunStatus.queued);
        run = scrapeRunRepository.save(run);
        UUID runId = run.getId();

        // Update monitor status
        monitor.setStatus(Monitor.MonitorStatus.running);
        monitorRepository.save(monitor);

        // Kick off async execution
        executeRunAsync(runId, vendorId, pricingUrl, monitor.getId(), 0);

        return runId;
    }

    // ── Async execution ───────────────────────────────────────────────────────

    @Async("scraperExecutor")
    public void executeRunAsync(UUID runId, UUID vendorId, String pricingUrl,
                                UUID monitorId, int attempt) {
        MDC.put("scrapeRunId", runId.toString());
        MDC.put("vendorId", vendorId.toString());
        try {
            executeRun(runId, vendorId, pricingUrl, monitorId, attempt);
        } finally {
            MDC.remove("scrapeRunId");
            MDC.remove("vendorId");
        }
    }

    private void executeRun(UUID runId, UUID vendorId, String pricingUrl,
                            UUID monitorId, int attempt) {
        log.info("Starting scrape run={} vendor={} attempt={}", runId, vendorId, attempt);
        try {
            // Start Bright Data job
            final String jobId = brightDataClient.startJob(pricingUrl, "v1");
            updateRun(runId, ScrapeRun.ScrapeRunStatus.running, run -> run.setRawResultRef(jobId));

            Monitor monitor = monitorRepository.findById(monitorId).orElseThrow();
            monitor.setScraperJobId(jobId);
            monitorRepository.save(monitor);

            // Poll for result
            BrightDataClient.BrightDataJobResult result = pollUntilDone(jobId);

            if (result == null || "failed".equals(result.status())) {
                String errMsg = result != null ? result.errorMessage() : "Polling timed out";
                handleFailure(runId, monitorId, errMsg);
                retryIfPossible(runId, vendorId, pricingUrl, monitorId, attempt, errMsg);
                return;
            }

            // Process success
            processSuccess(runId, vendorId, monitorId, pricingUrl, result);

        } catch (Exception e) {
            log.error("Scrape run={} failed with exception: {}", runId, e.getMessage(), e);
            handleFailure(runId, monitorId, e.getMessage());
            retryIfPossible(runId, vendorId, pricingUrl, monitorId, attempt, e.getMessage());
        }
    }

    private BrightDataClient.BrightDataJobResult pollUntilDone(String jobId)
            throws InterruptedException {
        for (int i = 0; i < pollMaxAttempts; i++) {
            BrightDataClient.BrightDataJobResult result = brightDataClient.pollJobStatus(jobId);
            if (result == null) return null;

            if ("ready".equals(result.status()) || "failed".equals(result.status())) {
                return result;
            }

            log.debug("Polling jobId={} attempt={}/{} status={}", jobId, i + 1,
                    pollMaxAttempts, result.status());
            Thread.sleep(pollIntervalMs);
        }
        log.warn("Polling timed out for jobId={} after {} attempts", jobId, pollMaxAttempts);
        return null;
    }

    @Transactional
    protected void processSuccess(UUID runId, UUID vendorId, UUID monitorId,
                                  String sourceUrl,
                                  BrightDataClient.BrightDataJobResult result) {
        SelfHealingInterpreter.Interpretation interp = interpreter.interpret(result);

        // Persist raw payload
        String ref = "bd-" + result.id();
        try {
            rawPayloadRepository.save(new RawPayload(ref,
                    objectMapper.writeValueAsString(interp.rawPayload())));
        } catch (Exception e) {
            log.warn("Could not persist raw payload for run={}: {}", runId, e.getMessage());
        }

        // Update ScrapeRun
        updateRun(runId, ScrapeRun.ScrapeRunStatus.succeeded, run -> {
            run.setRawResultRef(ref);
            run.setSelfHealed(interp.selfHealed());
            run.setFinishedAt(OffsetDateTime.now());
        });

        // Save PricingSnapshot
        PricingSnapshot snapshot = new PricingSnapshot();
        snapshot.setVendorId(vendorId);
        snapshot.setScrapeRunId(runId);
        snapshot.setCapturedAt(OffsetDateTime.now());
        snapshot.setSourceUrl(sourceUrl);
        snapshot.setExtractionConfidence(
                BigDecimal.valueOf(interp.extractionConfidence()));
        snapshot.setContentHash(sha256(interp.rawPayload().toString()));
        snapshot = snapshotRepository.save(snapshot);

        // Parse and save Plans
        List<Plan> newPlans = parsePlans(snapshot.getId(), interp.rawPayload());
        planRepository.saveAll(newPlans);

        // Update Monitor
        Monitor monitor = monitorRepository.findById(monitorId).orElseThrow();
        monitor.setStatus(interp.reviewRequired()
                ? Monitor.MonitorStatus.review_required
                : Monitor.MonitorStatus.healthy);
        monitor.setLastSuccessAt(OffsetDateTime.now());
        monitorRepository.save(monitor);

        // Diff against previous snapshot
        List<PricingSnapshot> twoLatest = snapshotRepository
                .findTop2ByVendorIdOrderByCapturedAtDesc(vendorId);

        if (twoLatest.size() == 2) {
            PricingSnapshot prev = twoLatest.get(1);
            PricingSnapshot curr = twoLatest.get(0);
            List<Plan> prevPlans = planRepository.findBySnapshotId(prev.getId());

            List<ChangeEvent> events = diffEngine.diff(prev, prevPlans, curr, newPlans);

            for (ChangeEvent event : events) {
                impactScoringService.applyExposure(event, vendorId, null, null);
                ChangeEvent saved = changeEventRepository.save(event);

                // LLM explanation (best-effort, non-blocking)
                try {
                    Optional<String> summary = llmExplanationService.explain(saved);
                    summary.ifPresent(s -> {
                        saved.setImpactSummary(s);
                        changeEventRepository.save(saved);
                    });
                } catch (Exception e) {
                    log.warn("LLM explanation failed for changeEvent={}: {}",
                            saved.getId(), e.getMessage());
                }
            }

            log.info("Diff complete for vendor={}: {} change event(s) created", vendorId, events.size());
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void handleFailure(UUID runId, UUID monitorId, String errorMessage) {
        updateRun(runId, ScrapeRun.ScrapeRunStatus.failed, run -> {
            run.setErrorMessage(errorMessage);
            run.setFinishedAt(OffsetDateTime.now());
        });
        monitorRepository.findById(monitorId).ifPresent(m -> {
            m.setStatus(Monitor.MonitorStatus.failed);
            monitorRepository.save(m);
        });
    }

    private void retryIfPossible(UUID runId, UUID vendorId, String pricingUrl,
                                 UUID monitorId, int attempt, String reason) {
        if (attempt < retryMaxAttempts) {
            long backoffMs = (long) Math.pow(2, attempt) * 5000L;
            log.info("Retrying scrape vendor={} attempt={}/{} backoff={}ms reason={}",
                    vendorId, attempt + 1, retryMaxAttempts, backoffMs, reason);
            try {
                Thread.sleep(backoffMs);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return;
            }
            // Create new ScrapeRun for retry
            ScrapeRun retryRun = new ScrapeRun();
            retryRun.setMonitorId(monitorId);
            retryRun.setStatus(ScrapeRun.ScrapeRunStatus.queued);
            retryRun = scrapeRunRepository.save(retryRun);
            executeRunAsync(retryRun.getId(), vendorId, pricingUrl, monitorId, attempt + 1);
        } else {
            log.warn("Max retry attempts reached for vendor={}", vendorId);
        }
    }

    @FunctionalInterface
    private interface ScrapeRunMutator {
        void mutate(ScrapeRun run);
    }

    @Transactional
    protected void updateRun(UUID runId, ScrapeRun.ScrapeRunStatus status,
                              ScrapeRunMutator mutator) {
        scrapeRunRepository.findById(runId).ifPresent(run -> {
            run.setStatus(status);
            mutator.mutate(run);
            scrapeRunRepository.save(run);
        });
    }

    /**
     * Extracts Plan rows from the raw Bright Data payload.
     * Expects the payload to have a "plans" array; each element is a plan object.
     * Falls back gracefully if the structure is unexpected.
     */
    private List<Plan> parsePlans(UUID snapshotId, JsonNode payload) {
        List<Plan> plans = new ArrayList<>();
        if (payload == null) return plans;

        JsonNode plansNode = payload.get("plans");
        if (plansNode == null || !plansNode.isArray()) {
            log.warn("No 'plans' array in payload for snapshot={}", snapshotId);
            return plans;
        }

        for (JsonNode planNode : plansNode) {
            Plan p = new Plan();
            p.setSnapshotId(snapshotId);
            p.setName(planNode.path("name").asText("Unknown"));
            p.setNormalizedName(planNormalizer.normalizeName(
                    planNode.path("name").asText("Unknown")));

            if (planNode.has("price")) {
                try {
                    p.setPriceAmount(new BigDecimal(
                            planNode.get("price").asText().replaceAll("[^0-9.]", "")));
                } catch (NumberFormatException e) {
                    log.debug("Could not parse price for plan '{}'", p.getName());
                }
            }

            p.setCurrency(planNormalizer.normalizeCurrency(
                    planNode.path("currency").asText(null)));
            p.setBillingPeriod(planNormalizer.normalizeBillingPeriod(
                    planNode.path("billing_period").asText(null)));

            if (planNode.has("usage_limits")) {
                p.setUsageLimitsJson(planNode.get("usage_limits"));
            }
            if (planNode.has("features")) {
                p.setFeaturesJson(planNode.get("features"));
            }

            plans.add(p);
        }

        return plans;
    }

    private String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString();
        }
    }
}
