package com.pricesentinel.dto;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.exposure.Exposure;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.snapshot.PricingSnapshot;
import com.pricesentinel.vendor.Monitor;
import com.pricesentinel.vendor.Vendor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manual mappers from domain entities to DTOs.
 * Kept as static methods — no MapStruct dependency needed for hackathon scope.
 */
public final class DtoMapper {

    private DtoMapper() {}

    public static Dtos.VendorResponse toVendorResponse(Vendor v, Monitor m) {
        return new Dtos.VendorResponse(
                v.getId(),
                v.getName(),
                v.getCategory(),
                v.getPricingUrl(),
                m != null ? toMonitorStatus(m) : null
        );
    }

    public static Dtos.MonitorStatusResponse toMonitorStatus(Monitor m) {
        return new Dtos.MonitorStatusResponse(
                m.getId(),
                m.getStatus().name(),
                m.getSchedule().name(),
                m.getLastSuccessAt()
        );
    }

    public static Dtos.SnapshotResponse toSnapshotResponse(
            PricingSnapshot s, List<Plan> plans) {
        return new Dtos.SnapshotResponse(
                s.getId(),
                s.getCapturedAt(),
                s.getSourceUrl(),
                s.getExtractionConfidence(),
                plans.stream().map(DtoMapper::toPlanResponse).collect(Collectors.toList())
        );
    }

    public static Dtos.PlanResponse toPlanResponse(Plan p) {
        return new Dtos.PlanResponse(
                p.getId(),
                p.getName(),
                p.getNormalizedName(),
                p.getPriceAmount(),
                p.getCurrency(),
                p.getBillingPeriod(),
                p.getUsageLimitsJson(),
                p.getFeaturesJson()
        );
    }

    public static Dtos.AlertResponse toAlertResponse(ChangeEvent e, String vendorName) {
        return new Dtos.AlertResponse(
                e.getId(),
                e.getVendorId(),
                vendorName,
                e.getType().name(),
                e.getBaseScore(),
                e.getFinalScore(),
                e.getConfidence(),
                e.getImpactSummary(),
                e.getStatus().name(),
                e.getCreatedAt()
        );
    }

    public static Dtos.AlertDetailResponse toAlertDetail(ChangeEvent e, String vendorName) {
        return new Dtos.AlertDetailResponse(
                e.getId(),
                e.getVendorId(),
                vendorName,
                e.getType().name(),
                e.getBaseScore(),
                e.getFinalScore(),
                e.getConfidence(),
                e.getImpactSummary(),
                e.getStatus().name(),
                e.getCreatedAt(),
                e.getBeforeJson(),
                e.getAfterJson(),
                e.getBeforeSnapshotId(),
                e.getAfterSnapshotId()
        );
    }

    public static Dtos.ExposureResponse toExposureResponse(Exposure exp) {
        return new Dtos.ExposureResponse(
                exp.getId(),
                exp.getVendorId(),
                exp.getCurrentPlan(),
                exp.getSeatCount(),
                exp.getBillingCycle(),
                exp.getMonthlySpend(),
                exp.getUpdatedAt()
        );
    }

    public static Dtos.ScraperHealthResponse toScraperHealth(Monitor m) {
        return new Dtos.ScraperHealthResponse(
                m.getStatus().name(),
                m.getLastSuccessAt(),
                m.getSchedule().name(),
                m.getScraperJobId()
        );
    }
}
