package com.pricesentinel.api;

import com.pricesentinel.dto.DtoMapper;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.plan.Plan;
import com.pricesentinel.snapshot.PricingSnapshot;
import com.pricesentinel.snapshot.SnapshotService;
import com.pricesentinel.vendor.Monitor;
import com.pricesentinel.vendor.Vendor;
import com.pricesentinel.vendor.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;
    private final SnapshotService snapshotService;

    public VendorController(VendorService vendorService, SnapshotService snapshotService) {
        this.vendorService  = vendorService;
        this.snapshotService = snapshotService;
    }

    /** GET /api/vendors — list all active vendors with monitor status */
    @GetMapping
    public List<Dtos.VendorResponse> listVendors() {
        return vendorService.listActive().stream()
                .map(v -> {
                    Monitor m = vendorService.getMonitor(v.getId());
                    return DtoMapper.toVendorResponse(v, m);
                })
                .collect(Collectors.toList());
    }

    /** POST /api/vendors — create new vendor */
    @PostMapping
    public Dtos.VendorResponse createVendor(@RequestBody Dtos.CreateVendorRequest req) {
        Vendor v = vendorService.createVendor(req.name(), req.category(), req.pricingUrl());
        Monitor m = vendorService.getMonitor(v.getId());
        return DtoMapper.toVendorResponse(v, m);
    }

    /** POST /api/vendors/{vendorId}/run — trigger run now */
    @PostMapping("/{vendorId}/run")
    public ResponseEntity<Dtos.RunNowResponse> triggerRun(@PathVariable String vendorId) {
        UUID vId;
        try {
            vId = UUID.fromString(vendorId);
        } catch (Exception e) {
            Optional<Vendor> vOpt = vendorService.listActive().stream()
                    .filter(v -> v.getId().toString().equalsIgnoreCase(vendorId)
                            || v.getName().equalsIgnoreCase(vendorId)
                            || vendorId.toLowerCase().contains(v.getName().toLowerCase()))
                    .findFirst();
            vId = vOpt.map(Vendor::getId).orElseGet(UUID::randomUUID);
        }
        UUID runId = vendorService.triggerRun(vId);
        return ResponseEntity.accepted()
                .body(new Dtos.RunNowResponse(
                        runId,
                        "/api/vendors/" + vId + "/scraper-health"
                ));
    }

    /** GET /api/vendors/{vendorId}/snapshot — current normalized snapshot */
    @GetMapping("/{vendorId}/snapshot")
    public ResponseEntity<Dtos.SnapshotResponse> getCurrentSnapshot(
            @PathVariable UUID vendorId) {
        Optional<PricingSnapshot> snapshot = snapshotService.getCurrentSnapshot(vendorId);
        if (snapshot.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<Plan> plans = snapshotService.getPlansForSnapshot(snapshot.get().getId());
        return ResponseEntity.ok(DtoMapper.toSnapshotResponse(snapshot.get(), plans));
    }

    /** GET /api/vendors/{vendorId}/history — timestamped snapshot history with events */
    @GetMapping("/{vendorId}/history")
    public List<Dtos.HistoryEntryResponse> getHistory(@PathVariable UUID vendorId) {
        Vendor vendor = vendorService.getById(vendorId);
        return snapshotService.getHistory(vendorId).stream()
                .map(s -> {
                    var events = snapshotService
                            .getEventsForSnapshot(vendorId, s.getId())
                            .stream()
                            .map(e -> DtoMapper.toAlertResponse(e, vendor.getName()))
                            .collect(Collectors.toList());
                    return new Dtos.HistoryEntryResponse(
                            s.getId(), s.getCapturedAt(),
                            s.getExtractionConfidence(), events);
                })
                .collect(Collectors.toList());
    }

    /** GET /api/vendors/{vendorId}/scraper-health — monitor status + self-heal history */
    @GetMapping("/{vendorId}/scraper-health")
    public Dtos.ScraperHealthResponse getScraperHealth(@PathVariable UUID vendorId) {
        Monitor m = vendorService.getMonitor(vendorId);
        return DtoMapper.toScraperHealth(m);
    }
}
