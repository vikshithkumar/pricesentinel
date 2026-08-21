package com.pricesentinel.api;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEventService;
import com.pricesentinel.dto.DtoMapper;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.vendor.Vendor;
import com.pricesentinel.vendor.VendorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final ChangeEventService changeEventService;
    private final VendorRepository vendorRepository;

    public AlertController(ChangeEventService changeEventService,
                           VendorRepository vendorRepository) {
        this.changeEventService = changeEventService;
        this.vendorRepository   = vendorRepository;
    }

    /**
     * GET /api/alerts?status=open  (status optional; returns all if omitted)
     * Sorted by final_score desc per TRD.
     */
    @GetMapping
    public List<Dtos.AlertResponse> listAlerts(
            @RequestParam(required = false) String status) {

        ChangeEvent.ChangeEventStatus parsed = parseStatus(status);
        List<ChangeEvent> events = changeEventService.listByStatus(parsed);

        Map<UUID, String> vendorNames = vendorNames(events);
        return events.stream()
                .map(e -> DtoMapper.toAlertResponse(e, vendorNames.get(e.getVendorId())))
                .collect(Collectors.toList());
    }

    /** GET /api/alerts/{changeEventId} — full evidence */
    @GetMapping("/{changeEventId}")
    public ResponseEntity<Dtos.AlertDetailResponse> getAlert(
            @PathVariable UUID changeEventId) {

        ChangeEvent event = changeEventService.getById(changeEventId);
        String vendorName = vendorRepository.findById(event.getVendorId())
                .map(Vendor::getName).orElse("Unknown");

        return ResponseEntity.ok(DtoMapper.toAlertDetail(event, vendorName));
    }

    /** POST /api/alerts/{changeEventId}/dismiss */
    @PostMapping("/{changeEventId}/dismiss")
    public ResponseEntity<Dtos.AlertResponse> dismiss(@PathVariable UUID changeEventId) {
        ChangeEvent dismissed = changeEventService.dismiss(changeEventId);
        String vendorName = vendorRepository.findById(dismissed.getVendorId())
                .map(Vendor::getName).orElse("Unknown");
        return ResponseEntity.ok(DtoMapper.toAlertResponse(dismissed, vendorName));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private ChangeEvent.ChangeEventStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return ChangeEvent.ChangeEventStatus.valueOf(status.toLowerCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Map<UUID, String> vendorNames(List<ChangeEvent> events) {
        List<UUID> vendorIds = events.stream()
                .map(ChangeEvent::getVendorId).distinct().collect(Collectors.toList());
        return vendorRepository.findAllById(vendorIds).stream()
                .collect(Collectors.toMap(Vendor::getId, Vendor::getName));
    }
}
