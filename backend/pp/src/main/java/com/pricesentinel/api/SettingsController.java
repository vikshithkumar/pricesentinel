package com.pricesentinel.api;

import com.pricesentinel.dto.Dtos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private String name = "Jane Doe";
    private String email = "jane.doe@example.com";
    private String timeZone = "Eastern Time (US & Canada)";
    private String dateFormat = "MM/DD/YYYY";
    private String theme = "dark";

    @GetMapping
    public Dtos.UserSettingsResponse getSettings() {
        return new Dtos.UserSettingsResponse(name, email, timeZone, dateFormat, theme);
    }

    @PutMapping
    public ResponseEntity<Dtos.UserSettingsResponse> updateSettings(@RequestBody Dtos.UpdateSettingsRequest req) {
        if (req.name() != null && !req.name().isBlank()) {
            this.name = req.name();
        }
        if (req.email() != null && !req.email().isBlank()) {
            this.email = req.email();
        }
        if (req.timeZone() != null && !req.timeZone().isBlank()) {
            this.timeZone = req.timeZone();
        }
        if (req.dateFormat() != null && !req.dateFormat().isBlank()) {
            this.dateFormat = req.dateFormat();
        }
        if (req.theme() != null && !req.theme().isBlank()) {
            this.theme = req.theme();
        }

        return ResponseEntity.ok(new Dtos.UserSettingsResponse(name, email, timeZone, dateFormat, theme));
    }
}
