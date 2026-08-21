package com.pricesentinel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
public class RestClientConfig {

    @Value("${scraper.brightdata.base-url:https://api.brightdata.com}")
    private String brightDataBaseUrl;

    @Value("${scraper.brightdata.connect-timeout-ms:10000}")
    private int brightDataConnectTimeoutMs;

    @Value("${scraper.brightdata.read-timeout-ms:30000}")
    private int brightDataReadTimeoutMs;

    @Value("${llm.anthropic.base-url:https://api.anthropic.com}")
    private String anthropicBaseUrl;

    @Value("${llm.openai.base-url:https://api.openai.com}")
    private String openAiBaseUrl;

    @Value("${llm.anthropic.timeout-ms:8000}")
    private int llmTimeoutMs;

    @Bean("brightDataRestClient")
    public RestClient brightDataRestClient() {
        return RestClient.builder()
                .baseUrl(brightDataBaseUrl)
                .requestFactory(factory(brightDataConnectTimeoutMs, brightDataReadTimeoutMs))
                .build();
    }

    @Bean("anthropicRestClient")
    public RestClient anthropicRestClient() {
        return RestClient.builder()
                .baseUrl(anthropicBaseUrl)
                .requestFactory(factory(5000, llmTimeoutMs))
                .build();
    }

    @Bean("openAiRestClient")
    public RestClient openAiRestClient() {
        return RestClient.builder()
                .baseUrl(openAiBaseUrl)
                .requestFactory(factory(5000, llmTimeoutMs))
                .build();
    }

    private SimpleClientHttpRequestFactory factory(int connectMs, int readMs) {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(Duration.ofMillis(connectMs));
        f.setReadTimeout(Duration.ofMillis(readMs));
        return f;
    }
}
