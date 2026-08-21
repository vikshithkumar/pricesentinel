package com.pricesentinel.api;

import com.pricesentinel.dto.Dtos;
import com.pricesentinel.impact.FinancialImpactService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intelligence/financial-impact")
public class FinancialImpactController {

    private final FinancialImpactService financialImpactService;

    public FinancialImpactController(FinancialImpactService financialImpactService) {
        this.financialImpactService = financialImpactService;
    }

    /** GET /api/intelligence/financial-impact — Aggregated financial impact metrics */
    @GetMapping
    public ResponseEntity<Dtos.FinancialImpactResponse> getAnalysis() {
        return ResponseEntity.ok(financialImpactService.getFinancialImpactAnalysis());
    }

    /** POST /api/intelligence/financial-impact/reports/csv — Export CSV procurement report */
    @PostMapping("/reports/csv")
    public ResponseEntity<String> exportCsvReport() {
        String csvContent = financialImpactService.generateCsvReport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"financial_impact_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }
}
