package com.pricesentinel.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// Vendor responses
// ─────────────────────────────────────────────────────────────────────────────

public class Dtos {

    public record VendorResponse(
            UUID id,
            String name,
            String category,
            String pricingUrl,
            MonitorStatusResponse monitor
    ) {}

    public record MonitorStatusResponse(
            UUID monitorId,
            String status,
            String schedule,
            OffsetDateTime lastSuccessAt
    ) {}

    public record RunNowResponse(
            UUID scrapeRunId,
            String statusUrl
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Snapshot responses
    // ─────────────────────────────────────────────────────────────────────────

    public record SnapshotResponse(
            UUID snapshotId,
            OffsetDateTime capturedAt,
            String sourceUrl,
            BigDecimal extractionConfidence,
            List<PlanResponse> plans
    ) {}

    public record PlanResponse(
            UUID id,
            String name,
            String normalizedName,
            BigDecimal priceAmount,
            String currency,
            String billingPeriod,
            JsonNode usageLimits,
            JsonNode features
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // History response
    // ─────────────────────────────────────────────────────────────────────────

    public record HistoryEntryResponse(
            UUID snapshotId,
            OffsetDateTime capturedAt,
            BigDecimal extractionConfidence,
            List<AlertResponse> changeEvents
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Scraper health
    // ─────────────────────────────────────────────────────────────────────────

    public record ScraperHealthResponse(
            String status,
            OffsetDateTime lastSuccessAt,
            String schedule,
            String scraperJobId
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Exposure
    // ─────────────────────────────────────────────────────────────────────────

    public record ExposureRequest(
            String currentPlan,
            Integer seatCount,
            String billingCycle,
            BigDecimal monthlySpend   // nullable
    ) {}

    public record ExposureResponse(
            UUID id,
            UUID vendorId,
            String currentPlan,
            int seatCount,
            String billingCycle,
            BigDecimal monthlySpend,
            OffsetDateTime updatedAt
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Alert / ChangeEvent responses
    // ─────────────────────────────────────────────────────────────────────────

    public record AlertResponse(
            UUID changeEventId,
            UUID vendorId,
            String vendorName,
            String type,
            BigDecimal baseScore,
            BigDecimal finalScore,
            BigDecimal confidence,
            String impactSummary,
            String status,
            OffsetDateTime createdAt
    ) {}

    public record AlertDetailResponse(
            UUID changeEventId,
            UUID vendorId,
            String vendorName,
            String type,
            BigDecimal baseScore,
            BigDecimal finalScore,
            BigDecimal confidence,
            String impactSummary,
            String status,
            OffsetDateTime createdAt,
            JsonNode beforeJson,
            JsonNode afterJson,
            UUID beforeSnapshotId,
            UUID afterSnapshotId
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Dashboard
    // ─────────────────────────────────────────────────────────────────────────

    public record TrendResponse(List<com.pricesentinel.dashboard.DashboardService.TrendPoint> points) {}

    public record DashboardSummaryResponse(
            long totalMonitoredVendors,
            long openAlertsCount,
            BigDecimal totalAnnualImpact,
            BigDecimal overallScraperHealthPercent,
            long recentEventsCount
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Global Scraper Health Nerve Center
    // ─────────────────────────────────────────────────────────────────────────

    public record CollectorNodeResponse(
            UUID id,
            UUID vendorId,
            String vendorName,
            String collectorId,
            String category,
            String status,
            BigDecimal successRate,
            int latencyMs,
            OffsetDateTime lastScanAt
    ) {}

    public record ScraperHealthCenterResponse(
            BigDecimal globalSuccessRate,
            int avgLatencyMs,
            int activeScrapers,
            int degradedScrapers,
            int failedScrapers,
            List<CollectorNodeResponse> collectors
    ) {}

    public record PipelineActivityLogResponse(
            String id,
            String severity, // info, warning, error, success
            String message,
            OffsetDateTime timestamp,
            String collectorId
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Self-Healing Laboratory
    // ─────────────────────────────────────────────────────────────────────────

    public record BreakTestRequest(
            String collectorId,
            String targetUrl
    ) {}

    public record ApplyRepairRequest(
            String collectorId,
            String repairedSelector
    ) {}

    public record SelfHealingStatusResponse(
            String collectorId,
            String vendorName,
            String status,
            String failedSelector,
            String repairedSelector,
            int recoveryTimeMs,
            BigDecimal confidenceScore,
            List<String> fieldsRecovered
    ) {}

    public record SelfHealingLogResponse(
            UUID id,
            String collectorId,
            String vendorName,
            String failedSelector,
            String repairedSelector,
            int recoveryTimeMs,
            BigDecimal confidenceScore,
            String status,
            String fieldsRecovered,
            OffsetDateTime createdAt
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Financial Impact & Intelligence
    // ─────────────────────────────────────────────────────────────────────────

    public record VendorImpactScoreResponse(
            UUID vendorId,
            String vendorName,
            int impactScore,
            List<String> coreDrivers,
            BigDecimal annualDelta
    ) {}

    public record SpendCategoryResponse(
            String category,
            BigDecimal monthlySpend,
            double percentage
    ) {}

    public record FinancialImpactResponse(
            BigDecimal totalProjectedAnnualSpend,
            BigDecimal costVariancePercentage,
            List<SpendCategoryResponse> categoryBreakdown,
            List<VendorImpactScoreResponse> vendorImpactScores
    ) {}
}
