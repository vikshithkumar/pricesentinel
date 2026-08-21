package com.pricesentinel.selfhealing;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SelfHealingLogRepository extends JpaRepository<SelfHealingLog, UUID> {
    List<SelfHealingLog> findByCollectorIdOrderByCreatedAtDesc(String collectorId);
    List<SelfHealingLog> findAllByOrderByCreatedAtDesc();
}
