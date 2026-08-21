package com.pricesentinel.plan;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "plan")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "snapshot_id", nullable = false)
    private UUID snapshotId;

    @Column(nullable = false)
    private String name;

    @Column(name = "normalized_name", nullable = false)
    private String normalizedName;

    @Column(name = "price_amount", precision = 12, scale = 2)
    private BigDecimal priceAmount;

    private String currency;

    @Column(name = "billing_period")
    private String billingPeriod;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "usage_limits_json", columnDefinition = "jsonb")
    private JsonNode usageLimitsJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_json", columnDefinition = "jsonb")
    private JsonNode featuresJson;

    public Plan() {}

    // Getters and setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSnapshotId() { return snapshotId; }
    public void setSnapshotId(UUID snapshotId) { this.snapshotId = snapshotId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNormalizedName() { return normalizedName; }
    public void setNormalizedName(String normalizedName) { this.normalizedName = normalizedName; }

    public BigDecimal getPriceAmount() { return priceAmount; }
    public void setPriceAmount(BigDecimal priceAmount) { this.priceAmount = priceAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getBillingPeriod() { return billingPeriod; }
    public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }

    public JsonNode getUsageLimitsJson() { return usageLimitsJson; }
    public void setUsageLimitsJson(JsonNode usageLimitsJson) { this.usageLimitsJson = usageLimitsJson; }

    public JsonNode getFeaturesJson() { return featuresJson; }
    public void setFeaturesJson(JsonNode featuresJson) { this.featuresJson = featuresJson; }
}
