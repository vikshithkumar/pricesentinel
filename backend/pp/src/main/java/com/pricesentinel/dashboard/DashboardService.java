package com.pricesentinel.dashboard;

import com.pricesentinel.changeevent.ChangeEvent;
import com.pricesentinel.changeevent.ChangeEventRepository;
import com.pricesentinel.collector.CollectorNode;
import com.pricesentinel.collector.CollectorNodeRepository;
import com.pricesentinel.dto.Dtos;
import com.pricesentinel.vendor.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ChangeEventRepository changeEventRepository;
    private final VendorRepository vendorRepository;
    private final CollectorNodeRepository collectorRepository;

    public DashboardService(ChangeEventRepository changeEventRepository,
                            VendorRepository vendorRepository,
                            CollectorNodeRepository collectorRepository) {
        this.changeEventRepository = changeEventRepository;
        this.vendorRepository = vendorRepository;
        this.collectorRepository = collectorRepository;
    }

    /**
     * Returns a 30-day time series of (date, changeCount, avgImpactScore)
     * for the Recharts trend chart.
     */
    public List<TrendPoint> getTrend() {
        OffsetDateTime since = OffsetDateTime.now(ZoneOffset.UTC).minusDays(30);
        List<ChangeEvent> events = changeEventRepository.findAllSince(since);

        // Group by date
        Map<LocalDate, List<ChangeEvent>> byDate = events.stream()
                .collect(Collectors.groupingBy(e ->
                        e.getCreatedAt().toInstant()
                                .atZone(ZoneOffset.UTC)
                                .toLocalDate()));

        // Build a point for each of the past 30 days (zero-fill missing days)
        List<TrendPoint> points = new ArrayList<>();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            List<ChangeEvent> dayEvents = byDate.getOrDefault(date, List.of());

            BigDecimal avgScore = dayEvents.isEmpty() ? BigDecimal.ZERO
                    : dayEvents.stream()
                    .map(ChangeEvent::getFinalScore)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(dayEvents.size()), 2, RoundingMode.HALF_UP);

            points.add(new TrendPoint(date.toString(), dayEvents.size(), avgScore));
        }
        return points;
    }

    /**
     * Returns high-level summary KPIs for the dashboard header.
     */
    public Dtos.DashboardSummaryResponse getSummary() {
        long totalVendors = vendorRepository.count();
        List<ChangeEvent> openEvents = changeEventRepository.findByStatus(ChangeEvent.ChangeEventStatus.open);
        long openAlerts = openEvents.size();

        BigDecimal totalImpact = openEvents.stream()
                .map(ChangeEvent::getFinalScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .multiply(BigDecimal.valueOf(150.00)) // Scaled dollar weight per score point
                .setScale(2, RoundingMode.HALF_UP);

        List<CollectorNode> collectors = collectorRepository.findAll();
        double avgHealth = collectors.isEmpty() ? 99.4 : collectors.stream()
                .mapToDouble(c -> c.getSuccessRate().doubleValue())
                .average().orElse(99.4);

        OffsetDateTime since = OffsetDateTime.now(ZoneOffset.UTC).minusDays(30);
        long recentEvents = changeEventRepository.findAllSince(since).size();

        return new Dtos.DashboardSummaryResponse(
                totalVendors,
                openAlerts,
                totalImpact,
                BigDecimal.valueOf(avgHealth).setScale(2, RoundingMode.HALF_UP),
                recentEvents
        );
    }

    public record TrendPoint(String date, int changeCount, BigDecimal avgImpactScore) {}
}
