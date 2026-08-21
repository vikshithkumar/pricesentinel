import React from "react";
import { monitoringHealth } from "../mockData";

export const MonitoringHealth: React.FC = () => {
  return (
    <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 p-6 shadow-sm dark:shadow-glass transition-colors duration-200">
      <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-5">
        Vendor Monitoring Health
      </h3>

      <div className="flex flex-col gap-4">
        {monitoringHealth.map((item, idx) => {
          const pipColor = item.status === "Healthy" ? "bg-emerald-500 dark:bg-emerald-400" : item.status === "Stale" ? "bg-amber-500 dark:bg-amber-400" : "bg-red-500 dark:bg-red-400";

          return (
            <div key={idx}>
              <div className="flex justify-between items-center text-[13px] font-dm-sans">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${pipColor} shadow-xs`}></div>
                  <span className="text-carbon dark:text-bone font-medium">{item.status}</span>
                </div>
                <span className="font-geist font-medium text-carbon dark:text-bone">{item.count}</span>
              </div>

              <div className="w-full h-1.5 bg-vapor dark:bg-white/5 rounded-full overflow-hidden mt-2 border border-bone-light dark:border-white/5">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className={`h-full ${pipColor} transition-all duration-300`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



