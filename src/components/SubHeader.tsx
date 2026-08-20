import React from "react";
import { workspaceInfo } from "../mockData";

export const SubHeader: React.FC = () => {
  return (
    <div className="bg-[#fcfcfc] border-b border-[#e2e8f0] px-4 md:px-10 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-20 shadow-sm shrink-0">
      {/* Analyst Greeting */}
      <h2 className="font-inter text-[18px] sm:text-[20px] text-[#020520] font-semibold tracking-[-0.16px]">
        {workspaceInfo.userGreeting}
      </h2>

      {/* Sync Status & Period Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {/* Verification status telemetry */}
        <div className="flex items-center gap-1.5 text-[#374151] bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-1 rounded-full text-[12px] font-mono">
          <span className="material-symbols-outlined text-[14px] text-[#16ca2e]">check_circle</span>
          <span>{workspaceInfo.lastVerifiedText}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Refresh Trigger */}
          <button
            className="text-[#6b7280] hover:text-[#145aff] transition-colors p-1.5 rounded-full hover:bg-[#f0f4fe]"
            title="Manual Refresh"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <div className="h-5 w-px bg-[#e2e8f0]"></div>

          {/* Date Filter selector */}
          <div className="relative">
            <select className="appearance-none bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] text-[13px] font-inter font-medium py-1.5 pl-3 pr-8 text-[#020520] focus:ring-1 focus:ring-[#0099ff] focus:border-[#145aff] cursor-pointer hover:bg-[#f0f4fe] transition-colors">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


