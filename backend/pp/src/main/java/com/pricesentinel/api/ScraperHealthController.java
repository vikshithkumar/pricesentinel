package com.pricesentinel.api;

import com.pricesentinel.collector.ScraperHealthService;
import com.pricesentinel.dto.Dtos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrapers")
public class ScraperHealthController {

    private final ScraperHealthService scraperHealthService;

    public ScraperHealthController(ScraperHealthService scraperHealthService) {
        this.scraperHealthService = scraperHealthService;
    }

    /** GET /api/scrapers/health — Global Nerve Center metrics & list of collectors */
    @GetMapping("/health")
    public Dtos.ScraperHealthCenterResponse getHealth(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return scraperHealthService.getScraperHealthCenter(category, status);
    }

    /** GET /api/scrapers/logs — Pipeline activity log stream */
    @GetMapping("/logs")
    public List<Dtos.PipelineActivityLogResponse> getLogs() {
        return scraperHealthService.getPipelineActivityLogs();
    }

    /** POST /api/scrapers/{collectorId}/restart — Restart individual node */
    @PostMapping("/{collectorId}/restart")
    public ResponseEntity<Dtos.CollectorNodeResponse> restartCollector(
            @PathVariable String collectorId) {
        return ResponseEntity.ok(scraperHealthService.restartCollector(collectorId));
    }

    /** POST /api/scrapers/bulk-retry-stale — Bulk retry all stale collectors */
    @PostMapping("/bulk-retry-stale")
    public ResponseEntity<List<Dtos.CollectorNodeResponse>> bulkRetryStale() {
        return ResponseEntity.ok(scraperHealthService.bulkRetryStale());
    }
}
