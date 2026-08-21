package com.pricesentinel.impact;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEvent.ChangeEventType;
import com.pricesentinel.exposure.Exposure;
import com.pricesentinel.exposure.ExposureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ImpactScoringServiceTest {

    private ExposureRepository exposureRepository;
    private ImpactScoringService scoringService;

    @BeforeEach
    void setUp() {
        exposureRepository = mock(ExposureRepository.class);
        scoringService = new ImpactScoringService(exposureRepository);
    }

    @Test
    void baseScore_correctWeights() {
        assertEquals(new BigDecimal("0.40"), scoringService.baseScore(ChangeEventType.price));
        assertEquals(new BigDecimal("0.30"), scoringService.baseScore(ChangeEventType.usage_limit));
        assertEquals(new BigDecimal("0.20"), scoringService.baseScore(ChangeEventType.plan));
        assertEquals(new BigDecimal("0.10"), scoringService.baseScore(ChangeEventType.feature));
        assertEquals(new BigDecimal("0.05"), scoringService.baseScore(ChangeEventType.schema));
    }

    @Test
    void applyExposure_withoutExposureRecord_usesBaseScore() {
        UUID vendorId = UUID.randomUUID();
        when(exposureRepository.findByVendorId(vendorId)).thenReturn(Optional.empty());

        ChangeEvent event = new ChangeEvent();
        event.setType(ChangeEventType.price);
        event.setBaseScore(scoringService.baseScore(ChangeEventType.price));

        scoringService.applyExposure(event, vendorId, new BigDecimal("10.00"), new BigDecimal("12.00"));

        assertEquals(new BigDecimal("0.40"), event.getFinalScore());
    }

    @Test
    void applyExposure_withExposureRecord_calculatesMultiplier() {
        UUID vendorId = UUID.randomUUID();
        Exposure exp = new Exposure();
        exp.setVendorId(vendorId);
        exp.setSeatCount(10);
        exp.setBillingCycle("monthly");
        exp.setMonthlySpend(new BigDecimal("100.00"));

        when(exposureRepository.findByVendorId(vendorId)).thenReturn(Optional.of(exp));

        ChangeEvent event = new ChangeEvent();
        event.setType(ChangeEventType.price);
        event.setBaseScore(new BigDecimal("0.40"));

        scoringService.applyExposure(event, vendorId, new BigDecimal("10.00"), new BigDecimal("15.00"));

        assertNotNull(event.getFinalScore());
        assertTrue(event.getFinalScore().compareTo(BigDecimal.ZERO) > 0);
    }
}
