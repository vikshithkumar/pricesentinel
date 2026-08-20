import React from "react";
import { useNavigate } from "react-router-dom";
import { financialImpactBars } from "../mockData";

export const FinancialImpact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/intelligence/financial-impact")}
      className="bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] p-4 cursor-pointer hover:border-[#145aff]/40 transition-colors"
    >
      <h3 className="font-inter text-[16px] text-[#020520] font-semibold mb-4">
        Financial Impact Overview
      </h3>

      <div className="h-40 w-full rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] relative overflow-hidden flex items-end px-4 pb-2 gap-2">
        <div className="w-full flex justify-between items-end h-full pt-4">
          {financialImpactBars.map((bar, idx) => (
            <div
              key={idx}
              style={{ height: bar.height }}
              className={`w-1/12 rounded-t-sm relative transition-colors ${bar.active
                  ? bar.monthLabel === "Sep"
                    ? "bg-[#f26052] hover:bg-[#f26052]/90"
                    : "bg-[#ffa64d] hover:bg-[#ffa64d]/90"
                  : "bg-[#3b82f6]/30 hover:bg-[#3b82f6]/50"
                }`}
            >
              {bar.monthLabel && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#020520] font-bold">
                  {bar.monthLabel}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute top-4 left-4 font-mono text-[12px] text-[#374151]">
          Monthly Cost Variance
        </div>
      </div>
    </div>
  );
};

