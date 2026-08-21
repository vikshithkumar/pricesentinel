package com.pricesentinel.snapshot;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEventRepository;
import com.pricesentinel.common.EntityNotFoundException;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.plan.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class SnapshotService {

    private final PricingSnapshotRepository snapshotRepository;
    private final PlanRepository planRepository;
    private final ChangeEventRepository changeEventRepository;

    public SnapshotService(PricingSnapshotRepository snapshotRepository,
                           PlanRepository planRepository,
                           ChangeEventRepository changeEventRepository) {
        this.snapshotRepository    = snapshotRepository;
        this.planRepository        = planRepository;
        this.changeEventRepository = changeEventRepository;
    }

    /** Returns the most recent snapshot for a vendor, with its plans. */
    public Optional<PricingSnapshot> getCurrentSnapshot(UUID vendorId) {
        return snapshotRepository.findTopByVendorIdOrderByCapturedAtDesc(vendorId);
    }

    public List<Plan> getPlansForSnapshot(UUID snapshotId) {
        return planRepository.findBySnapshotId(snapshotId);
    }

    /** Returns all snapshots for history view, ordered newest-first. */
    public List<PricingSnapshot> getHistory(UUID vendorId) {
        return snapshotRepository.findByVendorIdOrderByCapturedAtDesc(vendorId);
    }

    /** Returns change events for a given snapshot (as the "after" snapshot). */
    public List<ChangeEvent> getEventsForSnapshot(UUID vendorId, UUID snapshotId) {
        return changeEventRepository
                .findByVendorIdAndAfterSnapshotId(vendorId, snapshotId);
    }

    public PricingSnapshot getSnapshotOrThrow(UUID snapshotId) {
        return snapshotRepository.findById(snapshotId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Snapshot not found: " + snapshotId));
    }
}
