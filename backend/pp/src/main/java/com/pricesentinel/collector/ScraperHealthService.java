package com.pricesentinel.collector;

import com.pricesentinel.dto.Dtos;
import com.pricesentinel.vendor.Vendor;
import com.pricesentinel.vendor.VendorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ScraperHealthService {

    private static final Logger log = LoggerFactory.getLogger(ScraperHealthService.class);

    private final CollectorNodeRepository collectorRepository;
    private final VendorRepository vendorRepository;

    public ScraperHealthService(CollectorNodeRepository collectorRepository,
                                VendorRepository vendorRepository) {
        this.collectorRepository = collectorRepository;
        this.vendorRepository = vendorRepository;
    }

    public Dtos.ScraperHealthCenterResponse getScraperHealthCenter(String category, String status) {
        List<CollectorNode> allNodes = collectorRepository.findAll();
        Map<UUID, String> vendorNames = vendorRepository.findAll().stream()
                .collect(Collectors.toMap(Vendor::getId, Vendor::getName));

        // Global metrics computation
        double avgSuccessRate = allNodes.isEmpty() ? 100.0 : allNodes.stream()
                .mapToDouble(n -> n.getSuccessRate().doubleValue())
                .average().orElse(100.0);

        int avgLatency = allNodes.isEmpty() ? 0 : (int) allNodes.stream()
                .mapToInt(CollectorNode::getLatencyMs)
                .average().orElse(0);

        int activeScrapers = (int) allNodes.stream()
                .filter(n -> "healthy".equalsIgnoreCase(n.getStatus()) || "recovering".equalsIgnoreCase(n.getStatus()))
                .count();

        int degradedScrapers = (int) allNodes.stream()
                .filter(n -> "degraded".equalsIgnoreCase(n.getStatus()) || "stale".equalsIgnoreCase(n.getStatus()))
                .count();

        int failedScrapers = (int) allNodes.stream()
                .filter(n -> "failed".equalsIgnoreCase(n.getStatus()) || "critical_stale".equalsIgnoreCase(n.getStatus()))
                .count();

        // Apply filters
        List<CollectorNode> filteredNodes = allNodes.stream()
                .filter(n -> category == null || category.isBlank() || "all".equalsIgnoreCase(category) || n.getCategory().equalsIgnoreCase(category))
                .filter(n -> status == null || status.isBlank() || "all".equalsIgnoreCase(status) || n.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());

        List<Dtos.CollectorNodeResponse> nodeResponses = filteredNodes.stream()
                .map(n -> new Dtos.CollectorNodeResponse(
                        n.getId(),
                        n.getVendorId(),
                        vendorNames.getOrDefault(n.getVendorId(), "Unknown"),
                        n.getCollectorId(),
                        n.getCategory(),
                        n.getStatus(),
                        n.getSuccessRate(),
                        n.getLatencyMs(),
                        n.getLastScanAt()
                ))
                .collect(Collectors.toList());

        return new Dtos.ScraperHealthCenterResponse(
                BigDecimal.valueOf(avgSuccessRate).setScale(2, RoundingMode.HALF_UP),
                avgLatency,
                activeScrapers,
                degradedScrapers,
                failedScrapers,
                nodeResponses
        );
    }

    @Transactional
    public Dtos.CollectorNodeResponse restartCollector(String collectorId) {
        CollectorNode node = collectorRepository.findByCollectorId(collectorId)
                .orElseThrow(() -> new IllegalArgumentException("Collector node not found: " + collectorId));

        node.setStatus("recovering");
        node.setLastScanAt(OffsetDateTime.now());
        node = collectorRepository.save(node);

        String vendorName = vendorRepository.findById(node.getVendorId())
                .map(Vendor::getName).orElse("Unknown");

        log.info("Collector node restart triggered for collectorId={}", collectorId);

        return new Dtos.CollectorNodeResponse(
                node.getId(),
                node.getVendorId(),
                vendorName,
                node.getCollectorId(),
                node.getCategory(),
                node.getStatus(),
                node.getSuccessRate(),
                node.getLatencyMs(),
                node.getLastScanAt()
        );
    }

    @Transactional
    public List<Dtos.CollectorNodeResponse> bulkRetryStale() {
        List<CollectorNode> staleNodes = collectorRepository.findAll().stream()
                .filter(n -> "stale".equalsIgnoreCase(n.getStatus()) || "critical_stale".equalsIgnoreCase(n.getStatus()) || "failed".equalsIgnoreCase(n.getStatus()))
                .collect(Collectors.toList());

        Map<UUID, String> vendorNames = vendorRepository.findAll().stream()
                .collect(Collectors.toMap(Vendor::getId, Vendor::getName));

        for (CollectorNode node : staleNodes) {
            node.setStatus("recovering");
            node.setLastScanAt(OffsetDateTime.now());
            collectorRepository.save(node);
        }

        log.info("Bulk retry executed for {} stale collector nodes", staleNodes.size());

        return staleNodes.stream()
                .map(n -> new Dtos.CollectorNodeResponse(
                        n.getId(),
                        n.getVendorId(),
                        vendorNames.getOrDefault(n.getVendorId(), "Unknown"),
                        n.getCollectorId(),
                        n.getCategory(),
                        n.getStatus(),
                        n.getSuccessRate(),
                        n.getLatencyMs(),
                        n.getLastScanAt()
                ))
                .collect(Collectors.toList());
    }

    public List<Dtos.PipelineActivityLogResponse> getPipelineActivityLogs() {
        OffsetDateTime now = OffsetDateTime.now();
        return List.of(
                new Dtos.PipelineActivityLogResponse(UUID.randomUUID().toString(), "success", "col_stripe_01 completed extraction. 0 schema changes detected.", now.minusMinutes(2), "col_stripe_01"),
                new Dtos.PipelineActivityLogResponse(UUID.randomUUID().toString(), "warning", "col_openai_02 DOM selector drift detected. Self-healing initialized.", now.minusMinutes(8), "col_openai_02"),
                new Dtos.PipelineActivityLogResponse(UUID.randomUUID().toString(), "info", "col_anthropic_03 scan completed successfully with 99.8% extraction confidence.", now.minusMinutes(14), "col_anthropic_03"),
                new Dtos.PipelineActivityLogResponse(UUID.randomUUID().toString(), "error", "col_aws_06 connection timeout after 30000ms. Queueing retry attempt 1/2.", now.minusMinutes(25), "col_aws_06")
        );
    }
}
