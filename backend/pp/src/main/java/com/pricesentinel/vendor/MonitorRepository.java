package com.pricesentinel.vendor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor, UUID> {

    Optional<Monitor> findByVendorId(UUID vendorId);

    List<Monitor> findAllByStatusNot(Monitor.MonitorStatus status);
}
