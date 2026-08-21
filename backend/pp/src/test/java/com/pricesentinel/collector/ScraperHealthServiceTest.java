package com.pricesentinel.collector;

import com.pricesentinel.dto.Dtos;
import com.pricesentinel.vendor.Vendor;
import com.pricesentinel.vendor.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScraperHealthServiceTest {

    @Mock
    private CollectorNodeRepository collectorRepository;

    @Mock
    private VendorRepository vendorRepository;

    private ScraperHealthService service;
    private UUID vendorId;
    private CollectorNode sampleNode;

    @BeforeEach
    void setUp() {
        service = new ScraperHealthService(collectorRepository, vendorRepository);
        vendorId = UUID.randomUUID();

        sampleNode = new CollectorNode();
        sampleNode.setId(UUID.randomUUID());
        sampleNode.setVendorId(vendorId);
        sampleNode.setCollectorId("col_test_01");
        sampleNode.setCategory("financial");
        sampleNode.setStatus("healthy");
        sampleNode.setSuccessRate(BigDecimal.valueOf(99.80));
        sampleNode.setLatencyMs(120);
        sampleNode.setLastScanAt(OffsetDateTime.now());
    }

    @Test
    void testGetScraperHealthCenter() {
        Vendor v = new Vendor();
        v.setId(vendorId);
        v.setName("TestVendor");

        when(collectorRepository.findAll()).thenReturn(List.of(sampleNode));
        when(vendorRepository.findAll()).thenReturn(List.of(v));

        Dtos.ScraperHealthCenterResponse response = service.getScraperHealthCenter(null, null);

        assertNotNull(response);
        assertEquals(1, response.activeScrapers());
        assertEquals(0, response.failedScrapers());
        assertEquals(1, response.collectors().size());
        assertEquals("col_test_01", response.collectors().get(0).collectorId());
    }

    @Test
    void testRestartCollector() {
        Vendor v = new Vendor();
        v.setId(vendorId);
        v.setName("TestVendor");

        when(collectorRepository.findByCollectorId("col_test_01")).thenReturn(Optional.of(sampleNode));
        when(collectorRepository.save(any())).thenReturn(sampleNode);
        when(vendorRepository.findById(vendorId)).thenReturn(Optional.of(v));

        Dtos.CollectorNodeResponse resp = service.restartCollector("col_test_01");

        assertNotNull(resp);
        assertEquals("recovering", resp.status());
    }
}
