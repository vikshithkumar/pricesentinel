import React from "react";
import { recentActivities } from "../mockData";

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-canvas-white rounded-xl border border-hairline shadow-sm p-md flex-1">
      <h3 className="font-body-strong text-[16px] text-ink font-semibold mb-4">
        Recent Activity
      </h3>

      {/* Timeline wrapper */}
      <div className="relative border-l border-hairline ml-3 space-y-4 pb-2">
        {recentActivities.map((act, idx) => (
          <div className="relative pl-5" key={idx}>
            {/* Timeline Dot */}
            <div
              className={`absolute -left-1.5 top-1 w-3 h-3 border-2 rounded-full ${act.statusColorClass}`}
            ></div>
            <p className="text-[12px] text-secondary font-data-tabular mb-0.5">
              {act.time}
            </p>
            <p className="text-[13px] text-ink font-medium">
              {act.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
