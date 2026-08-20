import React from "react";
import { useNavigate } from "react-router-dom";
import type { KpiData } from "../mockData";

interface KpiCardProps {
  kpi: KpiData;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const navigate = useNavigate();
  const isImpact = kpi.title === "Est. Annual Impact";
  const valueColorClass = isImpact ? "text-[#f26052]" : "text-[#020520]";

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
      className="bg-[#ffffff] p-5 rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] flex flex-col justify-between h-36 relative overflow-hidden group transition-all cursor-pointer hover:border-[#145aff]/40"
    >
      <div className="flex justify-between items-start z-10">
        <span className="font-inter text-[12px] text-[#374151] uppercase tracking-wider font-medium">
          {kpi.title}
        </span>
        <span className="material-symbols-outlined text-[20px] text-[#145aff]">
          {kpi.icon}
        </span>
      </div>

      <div className="z-10 flex items-baseline gap-2">
        <span className={`font-mono text-[32px] font-bold tracking-tight ${valueColorClass}`}>
          {kpi.value}
        </span>

        {kpi.trendText && (
          <span
            className={`font-mono text-[12px] flex items-center px-2 py-0.5 rounded-full font-medium ${kpi.trendType === "up"
                ? "text-[#16ca2e] bg-[#16ca2e]/10"
                : kpi.trendType === "error"
                  ? "text-[#f26052] bg-[#f26052]/10"
                  : "text-[#374151] bg-[#f1f5f9]"
              }`}
          >
            {kpi.trendType === "up" && (
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span>
            )}
            {kpi.trendText}
          </span>
        )}
      </div>

      {/* Subtle bottom indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#f0f4fe] group-hover:bg-[#145aff] transition-colors duration-150"></div>
    </div>
  );
};

