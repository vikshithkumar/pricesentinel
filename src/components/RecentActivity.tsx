import React from "react";
import { recentActivities } from "../mockData";

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] p-4 flex-1">
      <h3 className="font-inter text-[16px] text-[#020520] font-semibold mb-4">
        Recent Activity
      </h3>

      <div className="relative border-l border-[#e2e8f0] ml-3 space-y-4 pb-2">
        {recentActivities.map((act, idx) => (
          <div className="relative pl-5" key={idx}>
            <div className="absolute -left-1.5 top-1 w-3 h-3 border-2 border-[#ffffff] bg-[#145aff] rounded-full"></div>
            <p className="text-[12px] text-[#6b7280] font-mono mb-0.5">
              {act.time}
            </p>
            <p className="text-[13px] text-[#020520] font-inter font-medium">
              {act.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

