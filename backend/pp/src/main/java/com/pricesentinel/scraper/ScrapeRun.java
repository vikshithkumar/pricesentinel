package com.pricesentinel.scraper;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scrape_run")
public class ScrapeRun {

    public enum ScrapeRunStatus {
        queued, running, succeeded, failed
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "monitor_id", nullable = false)
    private UUID monitorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScrapeRunStatus status;

    @Column(name = "raw_result_ref")
    private String rawResultRef;

    @Column(name = "schema_version")
    private String schemaVersion;

    @Column(name = "self_healed", nullable = false)
    private boolean selfHealed = false;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "started_at", nullable = false, updatable = false)
    private OffsetDateTime startedAt = OffsetDateTime.now();

    @Column(name = "finished_at")
    private OffsetDateTime finishedAt;

    public ScrapeRun() {}

    // Getters and setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getMonitorId() { return monitorId; }
    public void setMonitorId(UUID monitorId) { this.monitorId = monitorId; }

    public ScrapeRunStatus getStatus() { return status; }
    public void setStatus(ScrapeRunStatus status) { this.status = status; }

    public String getRawResultRef() { return rawResultRef; }
    public void setRawResultRef(String rawResultRef) { this.rawResultRef = rawResultRef; }

    public String getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(String schemaVersion) { this.schemaVersion = schemaVersion; }

    public boolean isSelfHealed() { return selfHealed; }
    public void setSelfHealed(boolean selfHealed) { this.selfHealed = selfHealed; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(OffsetDateTime finishedAt) { this.finishedAt = finishedAt; }
}
