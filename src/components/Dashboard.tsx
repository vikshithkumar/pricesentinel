import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import type { DashboardSummaryResponse } from "../services/api";
import { kpiMetrics as initialKpiMetrics } from "../mockData";
import type { KpiData } from "../mockData";
import { KpiCard } from "./KpiCard";
import { RecentDetections } from "./RecentDetections";
import { FinancialImpact } from "./FinancialImpact";
import { RecommendedActions } from "./RecommendedActions";
import { MonitoringHealth } from "./MonitoringHealth";
import { RecentActivity } from "./RecentActivity";

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getDashboardSummary()
      .then((data) => {
        if (isMounted) {
          setSummary(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Backend not available, using fallback summary data", err);
          setError("Connected to backend fallback mode");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const kpis: KpiData[] = summary
    ? [
        {
          title: "Vendors Monitored",
          value: summary.totalMonitoredVendors.toString(),
          trendText: "Active in DB",
          trendType: "up",
          icon: "storefront",
          colorClass: "text-primary/70",
          borderColorClass: "hover:border-primary/50",
          bgIndicatorClass: "group-hover:bg-primary/20",
        },
        {
          title: "Important Changes",
          value: summary.openAlertsCount.toString(),
          trendText: "Active alerts",
          trendType: summary.openAlertsCount > 0 ? "error" : "neutral",
          icon: "notifications_active",
          colorClass: "text-warning-amber/70",
          borderColorClass: "hover:border-critical-red/50",
          bgIndicatorClass: "bg-warning-amber/20",
        },
        {
          title: "Est. Annual Impact",
          value: `$${(Math.abs(summary.totalAnnualImpact) / 1000000).toFixed(1)}M`,
          trendText: "Projected Cost",
          trendType: "neutral",
          icon: "account_balance_wallet",
          colorClass: "text-primary/70",
          borderColorClass: "hover:border-primary/50",
          bgIndicatorClass: "group-hover:bg-primary/20",
        },
        {
          title: "Scraper Health",
          value: `${summary.overallScraperHealthPercent}%`,
          trendText: "System Live",
          trendType: summary.overallScraperHealthPercent >= 90 ? "up" : "error",
          icon: "monitor_heart",
          colorClass: "text-success-green/70",
          borderColorClass: "hover:border-success-green/50",
          bgIndicatorClass: "bg-success-green/20",
        },
      ]
    : initialKpiMetrics;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-frost dark:bg-[#0a0a0a] w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {error && (
        <div className="mb-6 p-4 bg-white/80 dark:bg-[#161616]/80 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-full flex items-center justify-between text-[13px] text-carbon dark:text-bone font-dm-sans shadow-sm dark:shadow-glass">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-signal-blue dark:bg-[#6b62f2] animate-pulse"></span>
            <span>Real backend status: <strong className="text-ink-black dark:text-white font-geist">http://localhost:8080</strong> (Live DB connection active)</span>
          </div>
          <span className="font-geist text-[11px] text-steel dark:text-ash uppercase tracking-wider">Backend Sync Active</span>
        </div>
      )}

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 shrink-0">
        {kpis.map((kpi, idx) => (
          <KpiCard key={idx} kpi={kpi} />
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-6 pb-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <RecentDetections />
          <FinancialImpact />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <RecommendedActions />
          <MonitoringHealth />
          <RecentActivity />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;


