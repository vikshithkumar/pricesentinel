package com.pricesentinel.vendor;

import com.pricesentinel.common.EntityNotFoundException;
import com.pricesentinel.scraper.ScraperOrchestrator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class VendorService {

    private final VendorRepository vendorRepository;
    private final MonitorRepository monitorRepository;
    private final ScraperOrchestrator scraperOrchestrator;

    public VendorService(VendorRepository vendorRepository,
                         MonitorRepository monitorRepository,
                         ScraperOrchestrator scraperOrchestrator) {
        this.vendorRepository  = vendorRepository;
        this.monitorRepository = monitorRepository;
        this.scraperOrchestrator = scraperOrchestrator;
    }

    public List<Vendor> listActive() {
        return vendorRepository.findByActiveTrue();
    }

    public Vendor getById(UUID vendorId) {
        return vendorRepository.findById(vendorId)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + vendorId));
    }

    public Monitor getMonitor(UUID vendorId) {
        return monitorRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Monitor not found for vendor: " + vendorId));
    }

    /**
     * Triggers an async scrape run. Idempotent — returns existing runId if already running.
     */
    @Transactional
    public UUID triggerRun(UUID vendorId) {
        Vendor vendor = getById(vendorId);
        return scraperOrchestrator.triggerRun(vendorId, vendor.getPricingUrl());
    }
}
