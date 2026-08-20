import React from "react";
import { useNavigate } from "react-router-dom";
import type { KpiData } from "../mockData";

interface KpiCardProps {
  kpi: KpiData;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const navigate = useNavigate();
  const isImpact = kpi.title === "Est. Annual Impact";
  const valueColorClass = isImpact ? "text-critical-red" : "text-ink";

  const handleCardClick = () => {
    if (kpi.title === "Vendors Monitored") {
      navigate("/vendors");
    } else if (kpi.title === "Est. Annual Impact") {
      navigate("/intelligence/financial-impact");
    } else if (kpi.title === "Scraper Health") {
      navigate("/scrapers");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-canvas-white p-lg rounded-xl border border-hairline shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group transition-colors cursor-pointer ${kpi.borderColorClass}`}
    >
      <div className="flex justify-between items-start z-10">
        <span className="font-label-capsule text-[12px] text-secondary uppercase tracking-wider font-semibold">
          {kpi.title}
        </span>
        <span className={`material-symbols-outlined text-[20px] ${kpi.colorClass}`}>
          {kpi.icon}
        </span>
      </div>

      <div className="z-10 flex items-baseline gap-2">
        <span className={`font-display-md text-[32px] font-bold tracking-tight ${valueColorClass}`}>
          {kpi.value}
        </span>

        {kpi.trendText && (
          <span
            className={`font-data-tabular text-[12px] flex items-center px-1.5 py-0.5 rounded font-medium ${kpi.trendType === "up"
                ? "text-success-green bg-success-green/10"
                : kpi.trendType === "error"
                  ? "text-critical-red font-medium"
                  : "text-secondary"
              }`}
          >
            {kpi.trendType === "up" && (
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span>
            )}
            {kpi.trendText}
          </span>
        )}
      </div>

      {/* Hover bottom indicators */}
      <div
        className={`absolute bottom-0 left-0 w-full h-1 bg-surface-container transition-colors ${kpi.bgIndicatorClass}`}
      ></div>
    </div>
  );
};
