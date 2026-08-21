package com.pricesentinel.collector;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CollectorNodeRepository extends JpaRepository<CollectorNode, UUID> {
    Optional<CollectorNode> findByCollectorId(String collectorId);
    Optional<CollectorNode> findByVendorId(UUID vendorId);
    List<CollectorNode> findByCategory(String category);
    List<CollectorNode> findByStatus(String status);
}
