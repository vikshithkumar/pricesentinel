package com.pricesentinel.llm;

import com.pricesentinel.changeevent.ChangeEvent;

import java.util.Optional;

/**
 * Strategy interface for generating a natural-language explanation of a pricing change.
 *
 * <p>Implementations must be grounded strictly in the {@code before_json}/{@code after_json}
 * fields of the event — no external knowledge or price-lookup calls.
 *
 * <p>Selection is driven by {@code llm.provider} config property via
 * {@code @ConditionalOnProperty} on each implementation.
 */
public interface LlmExplanationProvider {

    /**
     * Generates a plain-English explanation of the change event.
     *
     * @param event the persisted change event with before/after JSON evidence
     * @return explanation string, or {@link Optional#empty()} if the LLM is unavailable/timed out
     */
    Optional<String> explain(ChangeEvent event);
}
