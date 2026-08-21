package com.pricesentinel.diff;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEvent.ChangeEventType;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.snapshot.PricingSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

/**
 * Deterministic field-level diff engine.
 *
 * <p>Rules (from TRD §7):
 * <ul>
 *   <li>Matches Plan rows across snapshots by {@code normalized_name}.</li>
 *   <li>Compares fields only when both sides have a non-null value.</li>
 *   <li>Currency or cadence mismatches are emitted as {@code schema} events, not price changes.</li>
 *   <li>Suppresses diffs when {@code extractionConfidence < 0.70} on either side.</li>
 * </ul>
 */
@Component
public class DiffEngine {

    private static final Logger log = LoggerFactory.getLogger(DiffEngine.class);
    private static final BigDecimal MIN_CONFIDENCE = new BigDecimal("0.70");

    private final ChangeClassifier classifier;
    private final ObjectMapper objectMapper;

    public DiffEngine(ChangeClassifier classifier, ObjectMapper objectMapper) {
        this.classifier = classifier;
        this.objectMapper = objectMapper;
    }

    /**
     * Computes a list of unsaved {@link ChangeEvent} drafts between two snapshots.
     * {@code base_score} and {@code confidence} are set; {@code final_score} defaults to
     * {@code base_score} and will be updated by {@link com.pricesentinel.impact.ImpactScoringService}.
     *
     * @param prev  the older snapshot with its plans
     * @param curr  the newer snapshot with its plans
     * @return list of change event drafts (may be empty if nothing changed)
     */
    public List<ChangeEvent> diff(
            PricingSnapshot prev, List<Plan> prevPlans,
            PricingSnapshot curr, List<Plan> currPlans) {

        List<ChangeEvent> events = new ArrayList<>();

        // Confidence guard
        if (prev.getExtractionConfidence().compareTo(MIN_CONFIDENCE) < 0
                || curr.getExtractionConfidence().compareTo(MIN_CONFIDENCE) < 0) {
            log.warn("Suppressing diff for vendor={} — low extraction confidence: prev={}, curr={}",
                    curr.getVendorId(), prev.getExtractionConfidence(), curr.getExtractionConfidence());
            return events;
        }

        Map<String, Plan> prevMap = indexByNormalizedName(prevPlans);
        Map<String, Plan> currMap = indexByNormalizedName(currPlans);

        // Plans removed
        for (String name : prevMap.keySet()) {
            if (!currMap.containsKey(name)) {
                events.add(buildPlanEvent(prev, curr, prevMap.get(name), null,
                        ChangeEventType.plan, BigDecimal.ONE));
            }
        }

        // Plans added
        for (String name : currMap.keySet()) {
            if (!prevMap.containsKey(name)) {
                events.add(buildPlanEvent(prev, curr, null, currMap.get(name),
                        ChangeEventType.plan, BigDecimal.ONE));
            }
        }

        // Matched plans — field-level diff
        for (String name : prevMap.keySet()) {
            if (!currMap.containsKey(name)) continue;
            Plan p = prevMap.get(name);
            Plan c = currMap.get(name);

            events.addAll(diffMatchedPlans(prev, curr, p, c));
        }

        return events;
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private List<ChangeEvent> diffMatchedPlans(
            PricingSnapshot prev, PricingSnapshot curr,
            Plan p, Plan c) {

        List<ChangeEvent> events = new ArrayList<>();

        // Currency / period mismatch → schema event
        if (bothNonNull(p.getCurrency(), c.getCurrency())
                && !p.getCurrency().equalsIgnoreCase(c.getCurrency())) {
            events.add(buildFieldEvent(prev, curr, p, c,
                    "currencyMismatch", ChangeEventType.schema, new BigDecimal("0.60")));
            return events; // don't diff price if currency changed
        }
        if (bothNonNull(p.getBillingPeriod(), c.getBillingPeriod())
                && !p.getBillingPeriod().equalsIgnoreCase(c.getBillingPeriod())) {
            events.add(buildFieldEvent(prev, curr, p, c,
                    "periodMismatch", ChangeEventType.schema, new BigDecimal("0.70")));
        }

        // Price diff
        if (bothNonNull(p.getPriceAmount(), c.getPriceAmount())
                && p.getPriceAmount().compareTo(c.getPriceAmount()) != 0) {
            events.add(buildFieldEvent(prev, curr, p, c,
                    "priceAmount", ChangeEventType.price, BigDecimal.ONE));
        }

        // Usage limits diff (structural node comparison)
        if (bothNonNull(p.getUsageLimitsJson(), c.getUsageLimitsJson())
                && !p.getUsageLimitsJson().equals(c.getUsageLimitsJson())) {
            events.add(buildFieldEvent(prev, curr, p, c,
                    "usageLimitsJson", ChangeEventType.usage_limit, new BigDecimal("0.90")));
        }

        // Features diff
        if (bothNonNull(p.getFeaturesJson(), c.getFeaturesJson())
                && !p.getFeaturesJson().equals(c.getFeaturesJson())) {
            events.add(buildFieldEvent(prev, curr, p, c,
                    "featuresJson", ChangeEventType.feature, new BigDecimal("0.90")));
        }

        return events;
    }

    private ChangeEvent buildFieldEvent(
            PricingSnapshot prev, PricingSnapshot curr,
            Plan p, Plan c, String field,
            ChangeEventType type, BigDecimal confidence) {

        ObjectNode beforeNode = objectMapper.createObjectNode();
        ObjectNode afterNode  = objectMapper.createObjectNode();

        beforeNode.put("planName", p.getName());
        beforeNode.put("field", field);
        afterNode.put("planName", c.getName());
        afterNode.put("field", field);

        addFieldValues(beforeNode, afterNode, field, p, c);

        return draft(prev, curr, type, beforeNode, afterNode,
                baseScore(type), confidence);
    }

    private ChangeEvent buildPlanEvent(
            PricingSnapshot prev, PricingSnapshot curr,
            Plan before, Plan after,
            ChangeEventType type, BigDecimal confidence) {

        JsonNode beforeNode = before != null ? planToJson(before) : objectMapper.nullNode();
        JsonNode afterNode  = after  != null ? planToJson(after)  : objectMapper.nullNode();

        return draft(prev, curr, type, beforeNode, afterNode,
                baseScore(type), confidence);
    }

    private void addFieldValues(ObjectNode before, ObjectNode after,
                                String field, Plan p, Plan c) {
        switch (field) {
            case "priceAmount" -> {
                if (p.getPriceAmount() != null) before.put("value", p.getPriceAmount());
                if (c.getPriceAmount() != null) after.put("value", c.getPriceAmount());
                if (p.getCurrency() != null) before.put("currency", p.getCurrency());
                if (c.getCurrency() != null) after.put("currency", c.getCurrency());
            }
            case "usageLimitsJson" -> {
                before.set("value", p.getUsageLimitsJson());
                after.set("value", c.getUsageLimitsJson());
            }
            case "featuresJson" -> {
                before.set("value", p.getFeaturesJson());
                after.set("value", c.getFeaturesJson());
            }
            case "currencyMismatch" -> {
                before.put("currency", p.getCurrency());
                after.put("currency", c.getCurrency());
            }
            case "periodMismatch" -> {
                before.put("billingPeriod", p.getBillingPeriod());
                after.put("billingPeriod", c.getBillingPeriod());
            }
            default -> {
                before.put("note", "see plan data");
                after.put("note", "see plan data");
            }
        }
    }

    private JsonNode planToJson(Plan plan) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("name", plan.getName());
        if (plan.getPriceAmount() != null) node.put("priceAmount", plan.getPriceAmount());
        if (plan.getCurrency() != null)    node.put("currency", plan.getCurrency());
        if (plan.getBillingPeriod() != null) node.put("billingPeriod", plan.getBillingPeriod());
        return node;
    }

    private ChangeEvent draft(
            PricingSnapshot prev, PricingSnapshot curr,
            ChangeEventType type, JsonNode beforeJson, JsonNode afterJson,
            BigDecimal baseScore, BigDecimal confidence) {

        ChangeEvent e = new ChangeEvent();
        e.setVendorId(curr.getVendorId());
        e.setBeforeSnapshotId(prev.getId());
        e.setAfterSnapshotId(curr.getId());
        e.setType(type);
        e.setBeforeJson(beforeJson);
        e.setAfterJson(afterJson);
        e.setBaseScore(baseScore);
        e.setFinalScore(baseScore);   // updated by ImpactScoringService
        e.setConfidence(confidence);
        e.setStatus(ChangeEvent.ChangeEventStatus.open);
        return e;
    }

    /** TRD §7 base score weights. */
    private BigDecimal baseScore(ChangeEventType type) {
        return switch (type) {
            case price       -> new BigDecimal("0.40");
            case usage_limit -> new BigDecimal("0.30");
            case plan        -> new BigDecimal("0.20");
            case feature     -> new BigDecimal("0.10");
            case schema      -> new BigDecimal("0.05");
        };
    }

    private Map<String, Plan> indexByNormalizedName(List<Plan> plans) {
        Map<String, Plan> map = new LinkedHashMap<>();
        for (Plan p : plans) {
            map.put(p.getNormalizedName(), p);
        }
        return map;
    }

    private boolean bothNonNull(Object a, Object b) {
        return a != null && b != null;
    }
}
