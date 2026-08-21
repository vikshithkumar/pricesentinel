import React from "react";
import { workspaceInfo } from "../mockData";

export const SubHeader: React.FC = () => {
  return (
    <div className="mx-4 md:mx-6 my-1 px-5 py-3.5 bg-white/60 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[20px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-20 shrink-0 transition-colors duration-200">
      {/* Analyst Greeting */}
      <div>
        <h2 className="font-geist text-[18px] sm:text-[20px] text-ink-black dark:text-bone font-medium tracking-tight">
          {workspaceInfo.userGreeting}
        </h2>
      </div>

      {/* Sync Status & Period Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {/* Verification status telemetry pill */}
        <div className="flex items-center gap-2 text-steel dark:text-ash bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-geist">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          <span>{workspaceInfo.lastVerifiedText}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Refresh Trigger */}
          <button
            className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            title="Manual Refresh"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <div className="h-4 w-px bg-bone-light dark:bg-white/10"></div>

          {/* Date Filter selector pill */}
          <div className="relative">
            <select className="appearance-none bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-full text-[13px] font-dm-sans font-medium py-1.5 pl-4 pr-9 text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors">
              <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Last 30 Days</option>
              <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Last 7 Days</option>
              <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};




