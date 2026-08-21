package com.pricesentinel.impact;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEvent.ChangeEventType;
import com.pricesentinel.exposure.Exposure;
import com.pricesentinel.exposure.ExposureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.UUID;

/**
 * Computes base_score and exposure-weighted final_score for a ChangeEvent.
 *
 * <p>Formula (TRD §7):
 * <pre>
 *   base_score = (price ? 0.40 : 0) + (usage_limit ? 0.30 : 0)
 *              + (plan ? 0.20 : 0) + (feature ? 0.10 : 0) + (schema ? 0.05 : 0)
 *
 *   exposureMultiplier = f(Exposure)  — 1.0 when no Exposure saved
 *   final_score = base_score * exposureMultiplier
 * </pre>
 *
 * <p>Usage-based products are labeled "Estimated impact — usage-dependent"
 * and excluded from the exact-dollar path.
 */
@Service
public class ImpactScoringService {

    private static final Logger log = LoggerFactory.getLogger(ImpactScoringService.class);

    private static final BigDecimal BASE_PRICE       = new BigDecimal("0.40");
    private static final BigDecimal BASE_USAGE_LIMIT = new BigDecimal("0.30");
    private static final BigDecimal BASE_PLAN        = new BigDecimal("0.20");
    private static final BigDecimal BASE_FEATURE     = new BigDecimal("0.10");
    private static final BigDecimal BASE_SCHEMA      = new BigDecimal("0.05");

    private static final BigDecimal DEFAULT_MULTIPLIER = BigDecimal.ONE;
    private static final int        SCALE = 4;

    private final ExposureRepository exposureRepository;

    public ImpactScoringService(ExposureRepository exposureRepository) {
        this.exposureRepository = exposureRepository;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Computes the base score for the given change type (no exposure).
     */
    public BigDecimal baseScore(ChangeEventType type) {
        return switch (type) {
            case price       -> BASE_PRICE;
            case usage_limit -> BASE_USAGE_LIMIT;
            case plan        -> BASE_PLAN;
            case feature     -> BASE_FEATURE;
            case schema      -> BASE_SCHEMA;
        };
    }

    /**
     * Applies exposure-based multiplier and updates the ChangeEvent draft in-place.
     *
     * @param event     draft ChangeEvent with base_score already set
     * @param vendorId  vendor to look up Exposure for
     * @param oldPrice  nullable; new plan's old price per unit (for exact-dollar calculation)
     * @param newPrice  nullable; new plan's new price per unit
     */
    public void applyExposure(ChangeEvent event, UUID vendorId,
                              BigDecimal oldPrice, BigDecimal newPrice) {

        Optional<Exposure> exposureOpt = exposureRepository.findByVendorId(vendorId);

        if (exposureOpt.isEmpty()) {
            log.debug("No exposure for vendor={} — using multiplier=1.0", vendorId);
            event.setFinalScore(event.getBaseScore());
            return;
        }

        Exposure exp = exposureOpt.get();
        BigDecimal multiplier = computeMultiplier(exp, oldPrice, newPrice);
        BigDecimal finalScore = event.getBaseScore()
                .multiply(multiplier)
                .setScale(2, RoundingMode.HALF_UP);

        event.setFinalScore(finalScore);

        log.debug("Scored vendor={} type={} base={} multiplier={} final={}",
                vendorId, event.getType(), event.getBaseScore(), multiplier, finalScore);
    }

    /**
     * Returns the annual cost impact description for display.
     * Returns "Estimated impact — usage-dependent" for usage billing.
     */
    public String annualCostLabel(Exposure exp, BigDecimal oldPrice, BigDecimal newPrice) {
        if ("usage".equalsIgnoreCase(exp.getBillingCycle())) {
            return "Estimated impact — usage-dependent";
        }
        if (oldPrice == null || newPrice == null) {
            return null;
        }

        BigDecimal delta = newPrice.subtract(oldPrice);
        int periodsPerYear = "annual".equalsIgnoreCase(exp.getBillingCycle()) ? 1 : 12;

        // If user supplied monthly_spend, use that as baseline instead of list price
        BigDecimal baseline = exp.getMonthlySpend() != null
                ? exp.getMonthlySpend()
                : oldPrice.multiply(BigDecimal.valueOf(exp.getSeatCount()));

        BigDecimal annualImpact = delta
                .multiply(BigDecimal.valueOf(exp.getSeatCount()))
                .multiply(BigDecimal.valueOf(periodsPerYear))
                .setScale(2, RoundingMode.HALF_UP);

        String direction = annualImpact.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return String.format("Annual cost change: %s$%,.2f (baseline ~$%,.2f/mo)",
                direction, annualImpact, baseline);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private BigDecimal computeMultiplier(Exposure exp, BigDecimal oldPrice, BigDecimal newPrice) {
        if ("usage".equalsIgnoreCase(exp.getBillingCycle())) {
            return BigDecimal.ONE; // usage-based: no exact multiplier
        }

        // If we have price data, scale multiplier by relative change magnitude
        if (oldPrice != null && newPrice != null
                && oldPrice.compareTo(BigDecimal.ZERO) > 0) {

            BigDecimal relativeChange = newPrice.subtract(oldPrice)
                    .abs()
                    .divide(oldPrice, SCALE, RoundingMode.HALF_UP);

            // seatFactor: 1 + log10(seats) to give diminishing returns for large seat counts
            double seatFactor = 1.0 + Math.log10(Math.max(1, exp.getSeatCount()));

            BigDecimal multiplier = BigDecimal.ONE
                    .add(relativeChange)
                    .multiply(BigDecimal.valueOf(seatFactor))
                    .setScale(2, RoundingMode.HALF_UP);

            // Cap at 5.0 to avoid absurd scores
            return multiplier.min(new BigDecimal("5.00"));
        }

        // Fallback: seat-count only multiplier
        double seatFactor = 1.0 + Math.log10(Math.max(1, exp.getSeatCount())) * 0.5;
        return BigDecimal.valueOf(seatFactor).setScale(2, RoundingMode.HALF_UP);
    }
}
