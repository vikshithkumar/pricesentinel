package com.pricesentinel.llm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pricesentinel.changeevent.ChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Anthropic Claude implementation of {@link LlmExplanationProvider}.
 * Active when {@code llm.provider=anthropic} (default).
 */
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "anthropic", matchIfMissing = true)
public class AnthropicExplanationProvider implements LlmExplanationProvider {

    private static final Logger log = LoggerFactory.getLogger(AnthropicExplanationProvider.class);

    @Value("${llm.anthropic.api-key:}")
    private String apiKey;

    @Value("${llm.anthropic.model:claude-3-5-sonnet-20241022}")
    private String model;

    @Value("${llm.anthropic.max-tokens:512}")
    private int maxTokens;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AnthropicExplanationProvider(
            @Qualifier("anthropicRestClient") RestClient restClient,
            ObjectMapper objectMapper) {
        this.restClient   = restClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public Optional<String> explain(ChangeEvent event) {
        if (apiKey == null || apiKey.isBlank()) {
            log.debug("ANTHROPIC_API_KEY not configured — skipping LLM explanation");
            return Optional.empty();
        }

        try {
            String prompt = buildPrompt(event);

            Map<String, Object> body = Map.of(
                    "model", model,
                    "max_tokens", maxTokens,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null) return Optional.empty();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> content =
                    (List<Map<String, Object>>) response.get("content");
            if (content == null || content.isEmpty()) return Optional.empty();

            String text = (String) content.get(0).get("text");
            return Optional.ofNullable(text).map(String::trim);

        } catch (Exception e) {
            log.warn("Anthropic LLM call failed for changeEvent={}: {}",
                    event.getId(), e.getMessage());
            return Optional.empty();
        }
    }

    private String buildPrompt(ChangeEvent event) {
        return """
                You are a pricing analyst. A SaaS vendor has changed their pricing.
                Explain in 2-3 concise sentences what changed and its likely business impact.
                Base your explanation ONLY on the structured data provided — do not use external knowledge.

                Change type: %s
                Confidence: %s
                Before: %s
                After: %s
                """.formatted(
                event.getType(),
                event.getConfidence(),
                event.getBeforeJson(),
                event.getAfterJson()
        );
    }
}
