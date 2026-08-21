package com.pricesentinel.changeevent;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "change_event")
public class ChangeEvent {

    public enum ChangeEventType {
        price, usage_limit, plan, feature, schema
    }

    public enum ChangeEventStatus {
        open, dismissed
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "vendor_id", nullable = false)
    private UUID vendorId;

    @Column(name = "before_snapshot_id", nullable = false)
    private UUID beforeSnapshotId;

    @Column(name = "after_snapshot_id", nullable = false)
    private UUID afterSnapshotId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChangeEventType type;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "before_json", nullable = false, columnDefinition = "jsonb")
    private JsonNode beforeJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "after_json", nullable = false, columnDefinition = "jsonb")
    private JsonNode afterJson;

    @Column(name = "base_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal baseScore;

    @Column(name = "final_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Column(nullable = false, precision = 4, scale = 3)
    private BigDecimal confidence;

    @Column(name = "impact_summary")
    private String impactSummary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChangeEventStatus status = ChangeEventStatus.open;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public ChangeEvent() {}

    // Getters and setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getVendorId() { return vendorId; }
    public void setVendorId(UUID vendorId) { this.vendorId = vendorId; }

    public UUID getBeforeSnapshotId() { return beforeSnapshotId; }
    public void setBeforeSnapshotId(UUID beforeSnapshotId) { this.beforeSnapshotId = beforeSnapshotId; }

    public UUID getAfterSnapshotId() { return afterSnapshotId; }
    public void setAfterSnapshotId(UUID afterSnapshotId) { this.afterSnapshotId = afterSnapshotId; }

    public ChangeEventType getType() { return type; }
    public void setType(ChangeEventType type) { this.type = type; }

    public JsonNode getBeforeJson() { return beforeJson; }
    public void setBeforeJson(JsonNode beforeJson) { this.beforeJson = beforeJson; }

    public JsonNode getAfterJson() { return afterJson; }
    public void setAfterJson(JsonNode afterJson) { this.afterJson = afterJson; }

    public BigDecimal getBaseScore() { return baseScore; }
    public void setBaseScore(BigDecimal baseScore) { this.baseScore = baseScore; }

    public BigDecimal getFinalScore() { return finalScore; }
    public void setFinalScore(BigDecimal finalScore) { this.finalScore = finalScore; }

    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }

    public String getImpactSummary() { return impactSummary; }
    public void setImpactSummary(String impactSummary) { this.impactSummary = impactSummary; }

    public ChangeEventStatus getStatus() { return status; }
    public void setStatus(ChangeEventStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
