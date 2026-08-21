package com.pricesentinel.changeevent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChangeEventRepository extends JpaRepository<ChangeEvent, UUID> {

    List<ChangeEvent> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);

    List<ChangeEvent> findByStatusOrderByFinalScoreDesc(ChangeEvent.ChangeEventStatus status);

    default List<ChangeEvent> findByStatus(ChangeEvent.ChangeEventStatus status) {
        return findByStatusOrderByFinalScoreDesc(status);
    }

    List<ChangeEvent> findAllByOrderByFinalScoreDesc();

    @Query("""
            SELECT c FROM ChangeEvent c
            WHERE c.vendorId = :vendorId
              AND c.afterSnapshotId = :afterSnapshotId
            """)
    List<ChangeEvent> findByVendorIdAndAfterSnapshotId(UUID vendorId, UUID afterSnapshotId);

    @Query("""
            SELECT c FROM ChangeEvent c
            WHERE c.createdAt >= :since
            ORDER BY c.createdAt ASC
            """)
    List<ChangeEvent> findAllSince(OffsetDateTime since);
}
