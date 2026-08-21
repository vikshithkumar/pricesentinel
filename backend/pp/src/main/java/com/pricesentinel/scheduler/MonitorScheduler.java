package com.pricesentinel.scheduler;

import com.pricesentinel.scraper.ScraperOrchestrator;
import com.pricesentinel.vendor.Monitor;
import com.pricesentinel.vendor.MonitorRepository;
import com.pricesentinel.vendor.VendorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Heartbeat scheduler (TRD §9).
 *
 * <p>A single {@code @Scheduled(fixedRate = 60_000)} tick checks all active monitors.
 * If a monitor is due (based on cadence), a scrape run is enqueued.
 * This avoids needing per-vendor Spring cron expressions.
 *
 * <p>Cadences:
 * <ul>
 *   <li>{@code demo_15m} → 900 seconds</li>
 *   <li>{@code daily} → 86400 seconds</li>
 * </ul>
 */
@Component
public class MonitorScheduler {

    private static final Logger log = LoggerFactory.getLogger(MonitorScheduler.class);

    private static final Duration DEMO_15M_CADENCE = Duration.ofMinutes(15);
    private static final Duration DAILY_CADENCE    = Duration.ofDays(1);

    private final MonitorRepository monitorRepository;
    private final VendorRepository vendorRepository;
    private final ScraperOrchestrator scraperOrchestrator;

    public MonitorScheduler(MonitorRepository monitorRepository,
                            VendorRepository vendorRepository,
                            ScraperOrchestrator scraperOrchestrator) {
        this.monitorRepository   = monitorRepository;
        this.vendorRepository    = vendorRepository;
        this.scraperOrchestrator = scraperOrchestrator;
    }

    @Scheduled(fixedRate = 60_000)
    public void heartbeat() {
        OffsetDateTime now = OffsetDateTime.now();

        // Skip monitors that are actively running
        List<Monitor> candidates = monitorRepository.findAllByStatusNot(Monitor.MonitorStatus.running);

        for (Monitor monitor : candidates) {
            if (isDue(monitor, now)) {
                vendorRepository.findById(monitor.getVendorId()).ifPresent(vendor -> {
                    if (vendor.isActive()) {
                        log.info("Scheduler enqueuing scrape for vendor={} monitor={}",
                                vendor.getId(), monitor.getId());
                        try {
                            scraperOrchestrator.triggerRun(vendor.getId(), vendor.getPricingUrl());
                        } catch (Exception e) {
                            log.error("Scheduler failed to trigger vendor={}: {}",
                                    vendor.getId(), e.getMessage());
                        }
                    }
                });
            }
        }
    }

    private boolean isDue(Monitor monitor, OffsetDateTime now) {
        if (monitor.getLastSuccessAt() == null) {
            // Never run → due immediately
            return true;
        }
        Duration cadence = cadenceFor(monitor.getSchedule());
        Duration sinceLastSuccess = Duration.between(monitor.getLastSuccessAt(), now);
        return sinceLastSuccess.compareTo(cadence) >= 0;
    }

    private Duration cadenceFor(Monitor.MonitorSchedule schedule) {
        return switch (schedule) {
            case demo_15m -> DEMO_15M_CADENCE;
            case daily    -> DAILY_CADENCE;
        };
    }
}
