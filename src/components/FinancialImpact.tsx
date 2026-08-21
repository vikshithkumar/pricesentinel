import React from "react";
import { useNavigate } from "react-router-dom";
import { financialImpactBars } from "../mockData";

export const FinancialImpact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/intelligence/financial-impact")}
      className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 p-6 cursor-pointer hover:border-mist dark:hover:border-white/25 transition-all shadow-sm dark:shadow-glass group"
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">
          Financial Impact Overview
        </h3>
        <span className="material-symbols-outlined text-[18px] text-steel dark:text-ash group-hover:text-carbon dark:group-hover:text-white transition-colors">
          arrow_forward
        </span>
      </div>

      <div className="h-44 w-full rounded-[16px] border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/[0.02] relative overflow-hidden flex items-end px-5 pb-3 gap-2">
        <div className="w-full flex justify-between items-end h-full pt-8">
          {financialImpactBars.map((bar, idx) => (
            <div
              key={idx}
              style={{ height: bar.height }}
              className={`w-1/12 rounded-t-[4px] relative transition-all duration-200 ${
                bar.active
                  ? bar.monthLabel === "Sep"
                    ? "bg-red-500 dark:bg-red-400 hover:bg-red-600 dark:hover:bg-red-300"
                    : "bg-amber-500 dark:bg-amber-400 hover:bg-amber-600 dark:hover:bg-amber-300"
                  : "bg-signal-blue/40 dark:bg-[#6b62f2]/40 hover:bg-signal-blue/70 dark:hover:bg-[#6b62f2]/70"
              }`}
            >
              {bar.monthLabel && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-geist text-carbon dark:text-bone font-medium">
                  {bar.monthLabel}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute top-4 left-5 font-dm-sans text-[12px] text-steel dark:text-ash">
          Monthly Cost Variance
        </div>
      </div>
    </div>
  );
};



