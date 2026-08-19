import React from "react";
import { kpiMetrics } from "../mockData";
import { KpiCard } from "./KpiCard";
import { RecentDetections } from "./RecentDetections";
import { FinancialImpact } from "./FinancialImpact";
import { RecommendedActions } from "./RecommendedActions";
import { MonitoringHealth } from "./MonitoringHealth";
import { RecentActivity } from "./RecentActivity";

export const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop bg-background">
      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter shrink-0">
        {kpiMetrics.map((kpi, idx) => (
          <KpiCard key={idx} kpi={kpi} />
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Column (Important Changes & Variance charts) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          <RecentDetections />
          <FinancialImpact />
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <RecommendedActions />
          <MonitoringHealth />
          <RecentActivity />
        </div>
      </div>
    </main>
  );
};
