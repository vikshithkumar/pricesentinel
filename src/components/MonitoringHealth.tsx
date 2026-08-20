import React from "react";
import { monitoringHealth } from "../mockData";

export const MonitoringHealth: React.FC = () => {
  return (
    <div className="bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] p-4">
      <h3 className="font-inter text-[16px] text-[#020520] font-semibold mb-4">
        Vendor Monitoring Health
      </h3>

      <div className="flex flex-col gap-3">
        {monitoringHealth.map((item, idx) => {
          const pipColor = item.status === "Healthy" ? "bg-[#16ca2e]" : item.status === "Stale" ? "bg-[#ffa64d]" : "bg-[#f26052]";

          return (
            <div key={idx}>
              <div className="flex justify-between items-center text-[13px] font-mono">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${pipColor}`}></div>
                  <span className="text-[#020520] font-inter font-medium">{item.status}</span>
                </div>
                <span className="font-semibold text-[#020520]">{item.count}</span>
              </div>

              <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden mt-1.5">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className={`h-full ${pipColor}`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

