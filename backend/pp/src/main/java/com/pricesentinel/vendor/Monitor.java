package com.pricesentinel.vendor;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "monitor")
public class Monitor {

    public enum MonitorStatus {
        idle, running, failed, healthy, review_required
    }

    public enum MonitorSchedule {
        demo_15m, daily
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "vendor_id", nullable = false)
    private UUID vendorId;

    @Column(name = "scraper_job_id")
    private String scraperJobId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitorSchedule schedule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitorStatus status = MonitorStatus.idle;

    @Column(name = "last_success_at")
    private OffsetDateTime lastSuccessAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Monitor() {}

    // Getters and setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }

    public String getScraperJobId() { return scraperJobId; }
    public void setScraperJobId(String scraperJobId) { this.scraperJobId = scraperJobId; }

    public MonitorSchedule getSchedule() { return schedule; }
    public void setSchedule(MonitorSchedule schedule) { this.schedule = schedule; }

    public MonitorStatus getStatus() { return status; }
    public void setStatus(MonitorStatus status) { this.status = status; }

    public OffsetDateTime getLastSuccessAt() { return lastSuccessAt; }
    public void setLastSuccessAt(OffsetDateTime lastSuccessAt) { this.lastSuccessAt = lastSuccessAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
