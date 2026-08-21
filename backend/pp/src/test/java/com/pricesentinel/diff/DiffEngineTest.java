package com.pricesentinel.diff;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEvent.ChangeEventType;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.snapshot.PricingSnapshot;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class DiffEngineTest {

    private DiffEngine diffEngine;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        ChangeClassifier classifier = new ChangeClassifier();
        diffEngine = new DiffEngine(classifier, objectMapper);
    }

    private PricingSnapshot createSnapshot(UUID vendorId, BigDecimal confidence) {
        PricingSnapshot s = new PricingSnapshot();
        s.setId(UUID.randomUUID());
        s.setVendorId(vendorId);
        s.setCapturedAt(OffsetDateTime.now());
        s.setExtractionConfidence(confidence);
        return s;
    }

    private Plan createPlan(PricingSnapshot s, String name, String normalizedName, BigDecimal price, String currency, String period) {
        Plan p = new Plan();
        p.setId(UUID.randomUUID());
        p.setSnapshotId(s.getId());
        p.setName(name);
        p.setNormalizedName(normalizedName);
        p.setPriceAmount(price);
        p.setCurrency(currency);
        p.setBillingPeriod(period);
        p.setUsageLimitsJson(objectMapper.createObjectNode());
        p.setFeaturesJson(objectMapper.createObjectNode());
        return p;
    }

    @Test
    void lowConfidence_suppressesDiff() {
        UUID vendorId = UUID.randomUUID();
        PricingSnapshot prev = createSnapshot(vendorId, new BigDecimal("0.65"));
        PricingSnapshot curr = createSnapshot(vendorId, new BigDecimal("0.90"));

        Plan p1 = createPlan(prev, "Pro", "pro", new BigDecimal("10.00"), "USD", "monthly");
        Plan p2 = createPlan(curr, "Pro", "pro", new BigDecimal("15.00"), "USD", "monthly");

        List<ChangeEvent> events = diffEngine.diff(prev, List.of(p1), curr, List.of(p2));
        assertTrue(events.isEmpty());
    }

    @Test
    void samePrice_noEvents() {
        UUID vendorId = UUID.randomUUID();
        PricingSnapshot prev = createSnapshot(vendorId, new BigDecimal("0.95"));
        PricingSnapshot curr = createSnapshot(vendorId, new BigDecimal("0.95"));

        Plan p1 = createPlan(prev, "Pro", "pro", new BigDecimal("10.00"), "USD", "monthly");
        Plan p2 = createPlan(curr, "Pro", "pro", new BigDecimal("10.00"), "USD", "monthly");

        List<ChangeEvent> events = diffEngine.diff(prev, List.of(p1), curr, List.of(p2));
        assertTrue(events.isEmpty());
    }

    @Test
    void priceIncrease_createsPriceEvent() {
        UUID vendorId = UUID.randomUUID();
        PricingSnapshot prev = createSnapshot(vendorId, new BigDecimal("0.95"));
        PricingSnapshot curr = createSnapshot(vendorId, new BigDecimal("0.95"));

        Plan p1 = createPlan(prev, "Pro", "pro", new BigDecimal("10.00"), "USD", "monthly");
        Plan p2 = createPlan(curr, "Pro", "pro", new BigDecimal("15.00"), "USD", "monthly");

        List<ChangeEvent> events = diffEngine.diff(prev, List.of(p1), curr, List.of(p2));
        assertEquals(1, events.size());
        ChangeEvent event = events.get(0);
        assertEquals(ChangeEventType.price, event.getType());
    }

    @Test
    void currencyMismatch_createsSchemaEvent() {
        UUID vendorId = UUID.randomUUID();
        PricingSnapshot prev = createSnapshot(vendorId, new BigDecimal("0.95"));
        PricingSnapshot curr = createSnapshot(vendorId, new BigDecimal("0.95"));

        Plan p1 = createPlan(prev, "Pro", "pro", new BigDecimal("10.00"), "USD", "monthly");
        Plan p2 = createPlan(curr, "Pro", "pro", new BigDecimal("10.00"), "EUR", "monthly");

        List<ChangeEvent> events = diffEngine.diff(prev, List.of(p1), curr, List.of(p2));
        assertEquals(1, events.size());
        ChangeEvent event = events.get(0);
        assertEquals(ChangeEventType.schema, event.getType());
    }

    @Test
    void planAddedAndRemoved_createsPlanEvents() {
        UUID vendorId = UUID.randomUUID();
        PricingSnapshot prev = createSnapshot(vendorId, new BigDecimal("0.95"));
        PricingSnapshot curr = createSnapshot(vendorId, new BigDecimal("0.95"));

        Plan pOld = createPlan(prev, "Old Plan", "old_plan", new BigDecimal("5.00"), "USD", "monthly");
        Plan pNew = createPlan(curr, "New Plan", "new_plan", new BigDecimal("20.00"), "USD", "monthly");

        List<ChangeEvent> events = diffEngine.diff(prev, List.of(pOld), curr, List.of(pNew));
        assertEquals(2, events.size());
        assertTrue(events.stream().allMatch(e -> e.getType() == ChangeEventType.plan));
    }
}
