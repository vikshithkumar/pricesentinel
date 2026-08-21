package com.pricesentinel.snapshot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PricingSnapshotRepository extends JpaRepository<PricingSnapshot, UUID> {

    Optional<PricingSnapshot> findTopByVendorIdOrderByCapturedAtDesc(UUID vendorId);

    List<PricingSnapshot> findByVendorIdOrderByCapturedAtDesc(UUID vendorId);

    /**
     * Returns the two most recent snapshots for diff purposes.
     */
    List<PricingSnapshot> findTop2ByVendorIdOrderByCapturedAtDesc(UUID vendorId);
}
