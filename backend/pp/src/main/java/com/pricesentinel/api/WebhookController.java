package com.pricesentinel.api;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    /** POST /api/webhooks/brightdata — Bright Data async completion callback */
    @PostMapping("/brightdata")
    public ResponseEntity<Map<String, String>> handleBrightDataCallback(
            @RequestHeader(value = "X-BrightData-Signature", required = false) String signature,
            @RequestBody JsonNode payload) {

        log.info("Received Bright Data webhook callback. Payload size: {}", payload != null ? payload.size() : 0);
        return ResponseEntity.ok(Map.of("status", "received"));
    }
}
