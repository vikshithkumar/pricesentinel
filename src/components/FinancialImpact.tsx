import React from "react";
import { useNavigate } from "react-router-dom";
import { financialImpactBars } from "../mockData";

export const FinancialImpact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/intelligence/financial-impact")}
      className="bg-canvas-white rounded-xl border border-hairline shadow-sm p-md cursor-pointer hover:border-primary/50 transition-colors"
    >
      <h3 className="font-body-strong text-[16px] text-ink font-semibold mb-4">
        Financial Impact Overview
      </h3>

      <div className="h-40 w-full rounded border border-hairline bg-canvas-parchment relative overflow-hidden flex items-end px-4 pb-2 gap-2">
        {/* Bars render */}
        <div className="w-full flex justify-between items-end h-full pt-4">
          {financialImpactBars.map((bar, idx) => (
            <div
              key={idx}
              style={{ height: bar.height }}
              className={`w-1/12 rounded-t relative transition-colors ${
                bar.active
                  ? bar.monthLabel === "Sep"
                    ? "bg-critical-red/80 hover:bg-critical-red"
                    : "bg-warning-amber/60 hover:bg-warning-amber"
                  : "bg-surface-variant hover:bg-surface-dim"
              }`}
            >
              {bar.monthLabel && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-ink font-bold">
                  {bar.monthLabel}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 font-data-tabular text-[12px] text-secondary">
          Monthly Cost Variance
        </div>
      </div>
    </div>
  );
};
