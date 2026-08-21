package com.pricesentinel.api;

import com.pricesentinel.dto.Dtos;
import com.pricesentinel.selfhealing.SelfHealingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/self-healing")
public class SelfHealingController {

    private final SelfHealingService selfHealingService;

    public SelfHealingController(SelfHealingService selfHealingService) {
        this.selfHealingService = selfHealingService;
    }

    /** GET /api/self-healing/status/{collectorId} — DOM diff & repair status */
    @GetMapping("/status/{collectorId}")
    public ResponseEntity<Dtos.SelfHealingStatusResponse> getStatus(@PathVariable String collectorId) {
        return ResponseEntity.ok(selfHealingService.getStatus(collectorId));
    }

    /** POST /api/self-healing/break-test — Simulate selector breakage */
    @PostMapping("/break-test")
    public ResponseEntity<Dtos.SelfHealingStatusResponse> runBreakTest(@RequestBody Dtos.BreakTestRequest request) {
        return ResponseEntity.ok(selfHealingService.runBreakTest(request));
    }

    /** POST /api/self-healing/apply-repair — Apply repair & restore node */
    @PostMapping("/apply-repair")
    public ResponseEntity<Dtos.SelfHealingLogResponse> applyRepair(@RequestBody Dtos.ApplyRepairRequest request) {
        return ResponseEntity.ok(selfHealingService.applyRepair(request));
    }

    /** GET /api/self-healing/history — Fetch historical self-healing events */
    @GetMapping("/history")
    public List<Dtos.SelfHealingLogResponse> getHistory() {
        return selfHealingService.getHistory();
    }
}
