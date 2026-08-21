package com.pricesentinel.scraper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Thin HTTP client wrapping Bright Data Scraper Studio API.
 *
 * <p>The self-healing signal contract is intentionally isolated in
 * {@link SelfHealingInterpreter} — this class only knows start/poll.
 *
 * <p>When {@code BRIGHTDATA_API_KEY} is not set, both methods log a WARN
 * and return a dummy result (no NPE, no crash).
 */
@Component
public class BrightDataClient {

    private static final Logger log = LoggerFactory.getLogger(BrightDataClient.class);

    @Value("${scraper.brightdata.api-key:}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public BrightDataClient(
            @Qualifier("brightDataRestClient") RestClient restClient,
            ObjectMapper objectMapper) {
        this.restClient   = restClient;
        this.objectMapper = objectMapper;
    }

    // ── DTOs ──────────────────────────────────────────────────────────────────

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StartJobResponse(String id, String status) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record BrightDataJobResult(
            String id,
            String status,           // "ready" | "running" | "failed"
            boolean selfHealed,      // Bright Data self-heal indicator (swap point — see SelfHealingInterpreter)
            JsonNode data,           // extracted payload
            String errorMessage
    ) {}

    // ── Public methods ────────────────────────────────────────────────────────

    /**
     * Starts a Bright Data scraper job for the given URL.
     *
     * @param targetUrl     the vendor pricing page URL
     * @param schemaVersion the schema version string passed to the dataset
     * @return the job ID assigned by Bright Data
     */
    public String startJob(String targetUrl, String schemaVersion) {
        if (!isConfigured()) {
            log.warn("BRIGHTDATA_API_KEY not set — returning stub job ID for url={}", targetUrl);
            return "stub-job-" + System.currentTimeMillis();
        }

        try {
            Map<String, Object> body = Map.of(
                    "url", targetUrl,
                    "schema_version", schemaVersion != null ? schemaVersion : "v1"
            );

            StartJobResponse resp = restClient.post()
                    .uri("/scraper/job")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(StartJobResponse.class);

            log.info("Bright Data job started: jobId={} url={}", resp != null ? resp.id() : null, targetUrl);
            return resp != null ? resp.id() : null;

        } catch (Exception e) {
            log.error("Failed to start Bright Data job for url={}: {}", targetUrl, e.getMessage());
            throw new RuntimeException("Bright Data startJob failed: " + e.getMessage(), e);
        }
    }

    /**
     * Polls the status of a running Bright Data job.
     */
    public BrightDataJobResult pollJobStatus(String jobId) {
        if (!isConfigured()) {
            log.warn("BRIGHTDATA_API_KEY not set — returning stub succeeded result for jobId={}", jobId);
            return new BrightDataJobResult(jobId, "ready", false,
                    objectMapper.createObjectNode(), null);
        }

        try {
            return restClient.get()
                    .uri("/scraper/job/{id}", jobId)
                    .header("Authorization", "Bearer " + apiKey)
                    .retrieve()
                    .body(BrightDataJobResult.class);
        } catch (Exception e) {
            log.error("Failed to poll Bright Data job jobId={}: {}", jobId, e.getMessage());
            throw new RuntimeException("Bright Data pollJobStatus failed: " + e.getMessage(), e);
        }
    }

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }
}
