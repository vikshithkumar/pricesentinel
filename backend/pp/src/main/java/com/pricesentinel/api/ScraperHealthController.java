package com.pricesentinel.api;

import com.pricesentinel.collector.ScraperHealthService;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.scraper.BrightDataScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrapers")
public class ScraperHealthController {

    private final ScraperHealthService scraperHealthService;
    private final BrightDataScraperService brightDataScraperService;

    public ScraperHealthController(ScraperHealthService scraperHealthService,
                                   BrightDataScraperService brightDataScraperService) {
        this.scraperHealthService = scraperHealthService;
        this.brightDataScraperService = brightDataScraperService;
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

    /** POST /api/scrapers/scrape-real — Live web scrape target site via Bright Data pipeline */
    @PostMapping("/scrape-real")
    public ResponseEntity<Dtos.ScrapeRealDataResult> scrapeRealData(@RequestBody Dtos.ScrapeRealDataRequest req) {
        return ResponseEntity.ok(brightDataScraperService.scrapeLiveTarget(req.targetUrl(), req.vendorName()));
    }
}
