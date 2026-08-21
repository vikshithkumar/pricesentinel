import React from "react";
import { useNavigate } from "react-router-dom";
import type { KpiData } from "../mockData";

interface KpiCardProps {
  kpi: KpiData;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const navigate = useNavigate();
  const isImpact = kpi.title === "Est. Annual Impact";
  const valueColorClass = isImpact ? "text-red-600 dark:text-red-400" : "text-ink-black dark:text-bone";

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
      className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md p-6 rounded-[24px] border border-bone-light dark:border-white/10 hover:border-mist dark:hover:border-white/25 flex flex-col justify-between h-40 relative overflow-hidden group transition-all duration-200 cursor-pointer shadow-sm dark:shadow-glass"
    >
      <div className="flex justify-between items-start z-10">
        <span className="font-dm-sans text-[12px] text-steel dark:text-ash uppercase tracking-wider font-medium">
          {kpi.title}
        </span>
        <div className="w-8 h-8 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center text-carbon dark:text-bone group-hover:bg-[#e4e4e7] dark:group-hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-[18px]">
            {kpi.icon}
          </span>
        </div>
      </div>

      <div className="z-10 flex items-baseline gap-3">
        <span className={`font-geist text-[34px] font-medium tracking-tight ${valueColorClass}`}>
          {kpi.value}
        </span>

        {kpi.trendText && (
          <span
            className={`font-dm-sans text-[12px] flex items-center px-2.5 py-0.5 rounded-full font-medium border ${
              kpi.trendType === "up"
                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : kpi.trendType === "error"
                  ? "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20"
                  : "text-steel dark:text-ash bg-vapor dark:bg-white/5 border-bone-light dark:border-white/10"
            }`}
          >
            {kpi.trendType === "up" && (
              <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span>
            )}
            {kpi.trendText}
          </span>
        )}
      </div>

      {/* Signature Gradient Wash on Hover */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-signal-blue dark:via-[#6b62f2] to-transparent"></div>
    </div>
  );
};



