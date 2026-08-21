package com.pricesentinel.llm;

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
 * OpenAI GPT implementation of {@link LlmExplanationProvider}.
 * Active when {@code llm.provider=openai}.
 */
@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "openai")
public class OpenAiExplanationProvider implements LlmExplanationProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAiExplanationProvider.class);

    @Value("${llm.openai.api-key:}")
    private String apiKey;

    @Value("${llm.openai.model:gpt-4o-mini}")
    private String model;

    @Value("${llm.openai.max-tokens:512}")
    private int maxTokens;

    private final RestClient restClient;

    public OpenAiExplanationProvider(
            @Qualifier("openAiRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public Optional<String> explain(ChangeEvent event) {
        if (apiKey == null || apiKey.isBlank()) {
            log.debug("OPENAI_API_KEY not configured — skipping LLM explanation");
            return Optional.empty();
        }

        try {
            String prompt = buildPrompt(event);

            Map<String, Object> body = Map.of(
                    "model", model,
                    "max_tokens", maxTokens,
                    "messages", List.of(
                            Map.of("role", "system", "content",
                                    "You are a pricing analyst. Respond in 2-3 sentences only."),
                            Map.of("role", "user", "content", prompt)
                    )
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri("/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null) return Optional.empty();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) return Optional.empty();

            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message == null) return Optional.empty();

            String text = (String) message.get("content");
            return Optional.ofNullable(text).map(String::trim);

        } catch (Exception e) {
            log.warn("OpenAI LLM call failed for changeEvent={}: {}",
                    event.getId(), e.getMessage());
            return Optional.empty();
        }
    }

    private String buildPrompt(ChangeEvent event) {
        return """
                A SaaS vendor has changed their pricing.
                Change type: %s | Confidence: %s
                Before: %s
                After: %s
                What changed and what is the business impact?
                """.formatted(
                event.getType(),
                event.getConfidence(),
                event.getBeforeJson(),
                event.getAfterJson()
        );
    }
}
