package com.pricesentinel.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEventRepository;
import com.pricesentinel.diff.ChangeClassifier;
import com.pricesentinel.diff.DiffEngine;
import com.pricesentinel.exposure.ExposureRepository;
import com.pricesentinel.impact.ImpactScoringService;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.snapshot.PricingSnapshot;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FullRunIntegrationTest {

    private DiffEngine diffEngine;
    private ImpactScoringService impactScoringService;
    private ExposureRepository exposureRepository;
    private ChangeEventRepository changeEventRepository;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        ChangeClassifier classifier = new ChangeClassifier();
        diffEngine = new DiffEngine(classifier, objectMapper);
        exposureRepository = mock(ExposureRepository.class);
        changeEventRepository = mock(ChangeEventRepository.class);
        impactScoringService = new ImpactScoringService(exposureRepository);
    }

    @Test
    void testEndToEndDiffAndImpactPipeline() {
        UUID vendorId = UUID.randomUUID();

        // 1. Previous Snapshot & Plan
        PricingSnapshot prev = new PricingSnapshot();
        prev.setId(UUID.randomUUID());
        prev.setVendorId(vendorId);
        prev.setCapturedAt(OffsetDateTime.now().minusDays(1));
        prev.setExtractionConfidence(new BigDecimal("0.95"));

        Plan p1 = new Plan();
        p1.setId(UUID.randomUUID());
        p1.setSnapshotId(prev.getId());
        p1.setName("Team Plan");
        p1.setNormalizedName("team_plan");
        p1.setPriceAmount(new BigDecimal("20.00"));
        p1.setCurrency("USD");
        p1.setBillingPeriod("monthly");
        p1.setUsageLimitsJson(objectMapper.createObjectNode());
        p1.setFeaturesJson(objectMapper.createObjectNode());

        // 2. Current Snapshot & Plan (Price increased from $20 to $30)
        PricingSnapshot curr = new PricingSnapshot();
        curr.setId(UUID.randomUUID());
        curr.setVendorId(vendorId);
        curr.setCapturedAt(OffsetDateTime.now());
        curr.setExtractionConfidence(new BigDecimal("0.95"));

        Plan p2 = new Plan();
        p2.setId(UUID.randomUUID());
        p2.setSnapshotId(curr.getId());
        p2.setName("Team Plan");
        p2.setNormalizedName("team_plan");
        p2.setPriceAmount(new BigDecimal("30.00"));
        p2.setCurrency("USD");
        p2.setBillingPeriod("monthly");
        p2.setUsageLimitsJson(objectMapper.createObjectNode());
        p2.setFeaturesJson(objectMapper.createObjectNode());

        // 3. Compute Diff
        List<ChangeEvent> events = diffEngine.diff(prev, List.of(p1), curr, List.of(p2));
        assertEquals(1, events.size());

        ChangeEvent event = events.get(0);
        assertEquals(ChangeEvent.ChangeEventType.price, event.getType());
        assertNotNull(event.getBaseScore());

        // 4. Apply Exposure Impact Scoring
        when(exposureRepository.findByVendorId(vendorId)).thenReturn(Optional.empty());
        impactScoringService.applyExposure(event, vendorId, p1.getPriceAmount(), p2.getPriceAmount());

        assertNotNull(event.getFinalScore());
        assertEquals(event.getBaseScore(), event.getFinalScore());
    }
}
