package com.pricesentinel.llm;

import com.pricesentinel.changeevent.ChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Orchestrates provider selection and graceful fallback for LLM explanations.
 *
 * <p>Per TRD §8: on timeout/error/disabled key, this service catches the failure,
 * leaves {@code impact_summary = NULL}, and the deterministic diff still publishes.
 * Alerts are NEVER blocked on LLM availability.
 */
@Service
public class LlmExplanationService {

    private static final Logger log = LoggerFactory.getLogger(LlmExplanationService.class);

    private final Optional<LlmExplanationProvider> provider;

    public LlmExplanationService(Optional<LlmExplanationProvider> provider) {
        this.provider = provider;
    }

    /**
     * Requests an LLM explanation for the given change event.
     *
     * @param event a persisted {@link ChangeEvent}
     * @return explanation text, or {@link Optional#empty()} if unavailable
     */
    public Optional<String> explain(ChangeEvent event) {
        if (provider.isEmpty()) {
            log.debug("No LLM provider configured — skipping explanation for event={}",
                    event.getId());
            return Optional.empty();
        }

        try {
            return provider.get().explain(event);
        } catch (Exception e) {
            log.warn("LLM explanation failed for changeEvent={}: {}",
                    event.getId(), e.getMessage());
            return Optional.empty();
        }
    }
}
