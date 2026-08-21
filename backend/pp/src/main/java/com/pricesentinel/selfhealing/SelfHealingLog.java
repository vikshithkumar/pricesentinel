package com.pricesentinel.selfhealing;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "self_healing_log")
public class SelfHealingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "collector_id", nullable = false)
    private String collectorId;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(name = "failed_selector", nullable = false)
    private String failedSelector;

    @Column(name = "repaired_selector", nullable = false)
    private String repairedSelector;

    @Column(name = "recovery_time_ms", nullable = false)
    private int recoveryTimeMs;

    @Column(name = "confidence_score", nullable = false)
    private BigDecimal confidenceScore;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "fields_recovered", nullable = false)
    private String fieldsRecovered;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public SelfHealingLog() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCollectorId() { return collectorId; }
    public void setCollectorId(String collectorId) { this.collectorId = collectorId; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getFailedSelector() { return failedSelector; }
    public void setFailedSelector(String failedSelector) { this.failedSelector = failedSelector; }

    public String getRepairedSelector() { return repairedSelector; }
    public void setRepairedSelector(String repairedSelector) { this.repairedSelector = repairedSelector; }

    public int getRecoveryTimeMs() { return recoveryTimeMs; }
    public void setRecoveryTimeMs(int recoveryTimeMs) { this.recoveryTimeMs = recoveryTimeMs; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFieldsRecovered() { return fieldsRecovered; }
    public void setFieldsRecovered(String fieldsRecovered) { this.fieldsRecovered = fieldsRecovered; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
