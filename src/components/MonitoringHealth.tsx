import React from "react";
import { monitoringHealth } from "../mockData";

export const MonitoringHealth: React.FC = () => {
  return (
    <div className="bg-canvas-white rounded-xl border border-hairline shadow-sm p-md">
      <h3 className="font-body-strong text-[16px] text-ink font-semibold mb-4">
        Vendor Monitoring Health
      </h3>

      <div className="flex flex-col gap-3">
        {monitoringHealth.map((item, idx) => {
          // Map color classes from mock data
          const indicatorPipColor = item.colorClass;
          const progressBarColor = item.colorClass;

          return (
            <div key={idx}>
              {/* Telemetry Labels */}
              <div className="flex justify-between items-center text-[13px] font-data-tabular">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${indicatorPipColor}`}></div>
                  <span className="text-ink">{item.status}</span>
                </div>
                <span className="font-semibold text-ink">{item.count}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mt-1.5">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className={`h-full ${progressBarColor}`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
