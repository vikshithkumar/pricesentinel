package com.pricesentinel.api;

import com.pricesentinel.dto.DtoMapper;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.exposure.Exposure;
import com.pricesentinel.exposure.ExposureService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendors/{vendorId}/exposure")
public class ExposureController {

    private final ExposureService exposureService;

    public ExposureController(ExposureService exposureService) {
        this.exposureService = exposureService;
    }

    /** PUT /api/vendors/{vendorId}/exposure — upsert exposure */
    @PutMapping
    public ResponseEntity<Dtos.ExposureResponse> upsertExposure(
            @PathVariable UUID vendorId,
            @RequestBody @Valid ExposureRequest request) {

        Exposure saved = exposureService.upsert(
                vendorId,
                request.currentPlan(),
                request.seatCount(),
                request.billingCycle(),
                request.monthlySpend()
        );
        return ResponseEntity.ok(DtoMapper.toExposureResponse(saved));
    }

    /** GET /api/vendors/{vendorId}/exposure — fetch saved exposure */
    @GetMapping
    public ResponseEntity<Dtos.ExposureResponse> getExposure(@PathVariable UUID vendorId) {
        Optional<Exposure> exposure = exposureService.get(vendorId);
        return exposure.map(e -> ResponseEntity.ok(DtoMapper.toExposureResponse(e)))
                .orElse(ResponseEntity.noContent().build());
    }

    // ── Request DTO (local to controller for simplicity) ─────────────────────

    public record ExposureRequest(
            @NotBlank String currentPlan,
            @Min(1)   int seatCount,
            @NotBlank String billingCycle,
            java.math.BigDecimal monthlySpend
    ) {}
}
