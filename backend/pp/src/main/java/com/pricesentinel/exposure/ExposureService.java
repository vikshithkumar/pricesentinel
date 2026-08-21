package com.pricesentinel.exposure;

import com.pricesentinel.common.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ExposureService {

    private final ExposureRepository exposureRepository;

    public ExposureService(ExposureRepository exposureRepository) {
        this.exposureRepository = exposureRepository;
    }

    public Optional<Exposure> get(UUID vendorId) {
        return exposureRepository.findByVendorId(vendorId);
    }

    /**
     * Upserts the exposure record for a vendor.
     * If a record exists it is updated in-place; otherwise a new one is created.
     */
    @Transactional
    public Exposure upsert(UUID vendorId, String currentPlan, int seatCount,
                           String billingCycle, java.math.BigDecimal monthlySpend) {
        Exposure exposure = exposureRepository.findByVendorId(vendorId)
                .orElse(new Exposure());

        exposure.setVendorId(vendorId);
        exposure.setCurrentPlan(currentPlan);
        exposure.setSeatCount(seatCount);
        exposure.setBillingCycle(billingCycle);
        exposure.setMonthlySpend(monthlySpend);
        exposure.setUpdatedAt(OffsetDateTime.now());

        return exposureRepository.save(exposure);
    }

    public Exposure getOrThrow(UUID vendorId) {
        return exposureRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No exposure found for vendor: " + vendorId));
    }
}
