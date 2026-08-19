import React from "react";
import { workspaceInfo } from "../mockData";

export const SubHeader: React.FC = () => {
  return (
    <div className="bg-canvas-white border-b border-hairline px-margin-mobile md:px-margin-desktop py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-xs sm:gap-md z-20 shadow-sm shrink-0">
      {/* Analyst Greeting */}
      <h2 className="font-display-md text-[18px] sm:text-[20px] text-ink font-semibold tracking-tight">
        {workspaceInfo.userGreeting}
      </h2>

      {/* Sync Status & Period Filters */}
      <div className="flex flex-wrap items-center gap-xs sm:gap-md w-full sm:w-auto justify-between sm:justify-start">
        {/* Verification status telemetry */}
        <div className="flex items-center gap-xs text-secondary bg-surface-container-low px-2 py-1 rounded text-[11px] sm:text-[12px] font-data-tabular">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          <span>{workspaceInfo.lastVerifiedText}</span>
        </div>

        <div className="flex items-center gap-xs">
          {/* Manual Refresh Trigger */}
          <button
            className="text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-surface-container"
            title="Manual Refresh"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <div className="h-5 w-px bg-hairline mx-1"></div>

          {/* Date Filter selector */}
          <div className="relative">
            <select className="appearance-none bg-canvas-parchment border border-hairline rounded-md text-[12px] sm:text-[13px] font-medium py-1 sm:py-1.5 pl-2.5 pr-7 text-ink focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer hover:bg-surface-container transition-colors">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-secondary text-[16px] pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

