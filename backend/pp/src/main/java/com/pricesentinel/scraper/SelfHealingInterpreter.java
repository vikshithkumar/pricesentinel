package com.pricesentinel.scraper;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Maps a raw {@link BrightDataClient.BrightDataJobResult} to a structured interpretation.
 *
 * <p><b>Isolation note (TRD §6):</b> The exact Bright Data self-healing signal is not yet
 * confirmed. This class is the <em>single swap point</em> — change the logic here only
 * when the real API contract is known, without touching ScraperOrchestrator.
 *
 * <p>Current heuristics:
 * <ul>
 *   <li>{@code selfHealed = true} → reads the {@code self_healed} boolean field if present.</li>
 *   <li>{@code reviewRequired = true} → confidence field in the payload is below 0.70.</li>
 *   <li>{@code rawPayload} → the {@code data} node from the result.</li>
 * </ul>
 */
@Component
public class SelfHealingInterpreter {

    private static final Logger log = LoggerFactory.getLogger(SelfHealingInterpreter.class);
    private static final double REVIEW_CONFIDENCE_THRESHOLD = 0.70;

    public record Interpretation(
            boolean selfHealed,
            boolean reviewRequired,
            double  extractionConfidence,
            JsonNode rawPayload
    ) {}

    /**
     * Interprets a completed Bright Data job result.
     *
     * @param result a job result whose {@code status} is "ready"
     * @return structured interpretation for use by ScraperOrchestrator
     */
    public Interpretation interpret(BrightDataClient.BrightDataJobResult result) {
        boolean selfHealed = result.selfHealed(); // swap point

        double confidence = extractConfidence(result.data());
        boolean reviewRequired = confidence < REVIEW_CONFIDENCE_THRESHOLD;

        if (selfHealed) {
            log.info("Self-heal detected for jobId={}", result.id());
        }
        if (reviewRequired) {
            log.warn("Low extraction confidence={} for jobId={} — flagging review_required",
                    confidence, result.id());
        }

        return new Interpretation(selfHealed, reviewRequired, confidence, result.data());
    }

    // ── Private ───────────────────────────────────────────────────────────────

    /**
     * Extracts confidence from the payload.
     * Current heuristic: looks for a top-level {@code confidence} or
     * {@code extraction_confidence} numeric field; defaults to 1.0 (full trust)
     * if absent (legacy Bright Data responses without the field).
     */
    private double extractConfidence(JsonNode data) {
        if (data == null) return 0.0;
        for (String key : new String[]{"confidence", "extraction_confidence"}) {
            JsonNode node = data.get(key);
            if (node != null && node.isNumber()) {
                return node.doubleValue();
            }
        }
        return 1.0; // field absent → assume full confidence (legacy response)
    }
}
