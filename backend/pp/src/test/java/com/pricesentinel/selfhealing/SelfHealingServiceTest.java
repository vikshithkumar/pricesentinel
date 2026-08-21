package com.pricesentinel.selfhealing;

import com.pricesentinel.collector.CollectorNode;
import com.pricesentinel.collector.CollectorNodeRepository;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.vendor.Vendor;
import com.pricesentinel.vendor.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SelfHealingServiceTest {

    @Mock
    private SelfHealingLogRepository logRepository;

    @Mock
    private CollectorNodeRepository collectorRepository;

    @Mock
    private VendorRepository vendorRepository;

    private SelfHealingService service;
    private UUID vendorId;
    private CollectorNode sampleNode;

    @BeforeEach
    void setUp() {
        service = new SelfHealingService(logRepository, collectorRepository, vendorRepository);
        vendorId = UUID.randomUUID();

        sampleNode = new CollectorNode();
        sampleNode.setId(UUID.randomUUID());
        sampleNode.setVendorId(vendorId);
        sampleNode.setCollectorId("col_openai_02");
        sampleNode.setCategory("ecommerce");
        sampleNode.setStatus("degraded");
        sampleNode.setSuccessRate(BigDecimal.valueOf(94.20));
        sampleNode.setLatencyMs(320);
    }

    @Test
    void testApplyRepair() {
        Vendor v = new Vendor();
        v.setId(vendorId);
        v.setName("OpenAI");

        when(collectorRepository.findByCollectorId("col_openai_02")).thenReturn(Optional.of(sampleNode));
        when(vendorRepository.findById(vendorId)).thenReturn(Optional.of(v));

        SelfHealingLog savedLog = new SelfHealingLog();
        savedLog.setId(UUID.randomUUID());
        savedLog.setCollectorId("col_openai_02");
        savedLog.setVendorName("OpenAI");
        savedLog.setFailedSelector(".price-card .price-tag");
        savedLog.setRepairedSelector("[data-test=\"current-price\"]");
        savedLog.setRecoveryTimeMs(380);
        savedLog.setConfidenceScore(BigDecimal.valueOf(0.985));
        savedLog.setStatus("repaired");
        savedLog.setFieldsRecovered("price_amount, billing_period");

        when(logRepository.save(any())).thenReturn(savedLog);

        Dtos.ApplyRepairRequest request = new Dtos.ApplyRepairRequest("col_openai_02", "[data-test=\"current-price\"]");
        Dtos.SelfHealingLogResponse response = service.applyRepair(request);

        assertNotNull(response);
        assertEquals("repaired", response.status());
        assertEquals("[data-test=\"current-price\"]", response.repairedSelector());
    }
}
