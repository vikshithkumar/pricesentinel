package com.pricesentinel.selfhealing;

import com.pricesentinel.collector.CollectorNode;
import com.pricesentinel.collector.CollectorNodeRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SelfHealingService {

    private static final Logger log = LoggerFactory.getLogger(SelfHealingService.class);

    private final SelfHealingLogRepository logRepository;
    private final CollectorNodeRepository collectorRepository;
    private final VendorRepository vendorRepository;

    public SelfHealingService(SelfHealingLogRepository logRepository,
                              CollectorNodeRepository collectorRepository,
                              VendorRepository vendorRepository) {
        this.logRepository = logRepository;
        this.collectorRepository = collectorRepository;
        this.vendorRepository = vendorRepository;
    }

    @Transactional(readOnly = true)
    public Dtos.SelfHealingStatusResponse getStatus(String collectorId) {
        Optional<CollectorNode> nodeOpt = collectorRepository.findByCollectorId(collectorId);
        String vendorName = "Unknown Vendor";

        if (nodeOpt.isPresent()) {
            vendorName = vendorRepository.findById(nodeOpt.get().getVendorId())
                    .map(Vendor::getName).orElse("Unknown Vendor");
        }

        List<SelfHealingLog> logs = logRepository.findByCollectorIdOrderByCreatedAtDesc(collectorId);

        if (!logs.isEmpty()) {
            SelfHealingLog latest = logs.get(0);
            return new Dtos.SelfHealingStatusResponse(
                    latest.getCollectorId(),
                    latest.getVendorName(),
                    latest.getStatus(),
                    latest.getFailedSelector(),
                    latest.getRepairedSelector(),
                    latest.getRecoveryTimeMs(),
                    latest.getConfidenceScore(),
                    List.of(latest.getFieldsRecovered().split(", "))
            );
        }

        return new Dtos.SelfHealingStatusResponse(
                collectorId,
                vendorName,
                "healthy",
                ".price-card .price-tag",
                "[data-test=\"current-price\"]",
                0,
                BigDecimal.valueOf(1.00),
                List.of("price_amount", "billing_period", "tier_name")
        );
    }

    public Dtos.SelfHealingStatusResponse runBreakTest(Dtos.BreakTestRequest request) {
        String collectorId = request.collectorId() != null ? request.collectorId() : "col_openai_02";
        Optional<CollectorNode> nodeOpt = collectorRepository.findByCollectorId(collectorId);

        String vendorName = "OpenAI";
        if (nodeOpt.isPresent()) {
            CollectorNode node = nodeOpt.get();
            node.setStatus("degraded");
            collectorRepository.save(node);
            vendorName = vendorRepository.findById(node.getVendorId())
                    .map(Vendor::getName).orElse("OpenAI");
        }

        log.info("Break test executed for collectorId={}", collectorId);

        return new Dtos.SelfHealingStatusResponse(
                collectorId,
                vendorName,
                "failed",
                ".price-card .price-tag",
                "[data-test=\"current-price\"]",
                420,
                BigDecimal.valueOf(0.650),
                List.of("price_amount", "billing_period")
        );
    }

    public Dtos.SelfHealingLogResponse applyRepair(Dtos.ApplyRepairRequest request) {
        String collectorId = request.collectorId() != null ? request.collectorId() : "col_openai_02";
        String repairedSelector = request.repairedSelector() != null ? request.repairedSelector() : "[data-test=\"current-price\"]";

        Optional<CollectorNode> nodeOpt = collectorRepository.findByCollectorId(collectorId);
        String vendorName = "OpenAI";

        if (nodeOpt.isPresent()) {
            CollectorNode node = nodeOpt.get();
            node.setStatus("healthy");
            node.setSuccessRate(BigDecimal.valueOf(99.50));
            node.setLastScanAt(OffsetDateTime.now());
            collectorRepository.save(node);

            vendorName = vendorRepository.findById(node.getVendorId())
                    .map(Vendor::getName).orElse("OpenAI");
        }

        SelfHealingLog logEntry = new SelfHealingLog();
        logEntry.setCollectorId(collectorId);
        logEntry.setVendorName(vendorName);
        logEntry.setFailedSelector(".price-card .price-tag");
        logEntry.setRepairedSelector(repairedSelector);
        logEntry.setRecoveryTimeMs(380);
        logEntry.setConfidenceScore(BigDecimal.valueOf(0.985));
        logEntry.setStatus("repaired");
        logEntry.setFieldsRecovered("price_amount, billing_period, tier_name");
        logEntry = logRepository.save(logEntry);

        log.info("Self-healing repair applied successfully for collectorId={} with selector='{}'",
                collectorId, repairedSelector);

        return new Dtos.SelfHealingLogResponse(
                logEntry.getId(),
                logEntry.getCollectorId(),
                logEntry.getVendorName(),
                logEntry.getFailedSelector(),
                logEntry.getRepairedSelector(),
                logEntry.getRecoveryTimeMs(),
                logEntry.getConfidenceScore(),
                logEntry.getStatus(),
                logEntry.getFieldsRecovered(),
                logEntry.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<Dtos.SelfHealingLogResponse> getHistory() {
        return logRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(l -> new Dtos.SelfHealingLogResponse(
                        l.getId(),
                        l.getCollectorId(),
                        l.getVendorName(),
                        l.getFailedSelector(),
                        l.getRepairedSelector(),
                        l.getRecoveryTimeMs(),
                        l.getConfidenceScore(),
                        l.getStatus(),
                        l.getFieldsRecovered(),
                        l.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
