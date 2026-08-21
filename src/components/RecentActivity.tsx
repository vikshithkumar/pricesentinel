import React from "react";
import { recentActivities } from "../mockData";

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 p-6 flex-1 shadow-sm dark:shadow-glass transition-colors duration-200">
      <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-5">
        Recent Activity
      </h3>

      <div className="relative border-l border-bone-light dark:border-white/10 ml-2.5 space-y-5 pb-2">
        {recentActivities.map((act, idx) => (
          <div className="relative pl-6" key={idx}>
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 border-2 border-white dark:border-[#161616] bg-signal-blue dark:bg-bone rounded-full ring-2 ring-bone-light dark:ring-white/10"></div>
            <p className="text-[11px] text-steel dark:text-slate font-geist uppercase tracking-wider mb-1">
              {act.time}
            </p>
            <p className="text-[13px] text-carbon dark:text-bone font-dm-sans leading-relaxed">
              {act.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};



