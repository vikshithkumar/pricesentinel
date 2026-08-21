package com.pricesentinel.api;

import com.pricesentinel.dashboard.DashboardService;
import com.pricesentinel.dto.Dtos;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /** GET /api/dashboard/trend — 30-day time series for Recharts */
    @GetMapping("/trend")
    public Dtos.TrendResponse getTrend() {
        return new Dtos.TrendResponse(dashboardService.getTrend());
    }

    /** GET /api/dashboard/summary — Dashboard summary metrics & KPIs */
    @GetMapping("/summary")
    public Dtos.DashboardSummaryResponse getSummary() {
        return dashboardService.getSummary();
    }
}
