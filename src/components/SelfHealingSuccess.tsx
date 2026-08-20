import React from "react";
import { useNavigate } from "react-router-dom";

export const SelfHealingSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-10 bg-[#fcfcfc] relative overflow-hidden w-full max-w-[1400px] mx-auto min-h-screen">
      {/* Breadcrumb nav */}
      <nav className="absolute top-4 left-4 md:left-10 z-30 flex items-center gap-1.5 text-xs font-inter text-[#6b7280]">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Scraper Health</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>OpenAI</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Self-Healing Lab</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Success</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Propagation</span>
      </nav>

      {/* Success Recovery Card */}
      <div className="w-full max-w-3xl bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] p-6 md:p-10 flex flex-col gap-6 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-1">
          <div className="w-16 h-16 rounded-full bg-[#16ca2e]/10 flex items-center justify-center text-[#16ca2e] mb-2">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>
          <h2 className="font-inter text-[26px] md:text-[34px] font-semibold text-[#020520] tracking-[-1.48px]">
            SCRAPER RECOVERED
          </h2>
          <p className="font-inter text-[#374151] max-w-xl text-[14px] leading-relaxed">
            The visual DOM mapping was successfully repaired. Sentinel AI has synchronized the new extraction logic across all scraper nodes. Real-time monitoring has resumed.
          </p>
        </div>

        {/* Metadata Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e2e8f0] rounded-[12px] overflow-hidden border border-[#e2e8f0]">
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Vendor</span>
            <span className="font-inter font-semibold text-[#020520]">OpenAI</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Status</span>
            <span className="font-inter font-semibold text-[#16ca2e] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                sync
              </span>
              Synchronized
            </span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Last Verified</span>
            <span className="font-mono text-[#020520] font-semibold">10 seconds ago</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Recovery Time</span>
            <span className="font-mono text-[#020520] font-semibold">18.4 seconds</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Fields Recovered</span>
            <span className="font-mono font-semibold text-[#020520]">12 / 12</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Validation</span>
            <span className="font-inter font-semibold text-[#16ca2e]">Passed</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Data Quality</span>
            <span className="font-mono font-semibold text-[#020520]">100%</span>
          </div>
          <div className="p-4 bg-[#ffffff] flex flex-col justify-center">
            <span className="font-mono text-[10px] text-[#6b7280] uppercase font-medium tracking-wider mb-1">Confidence</span>
            <span className="font-mono font-semibold text-[#020520]">96.4%</span>
          </div>
        </div>

        {/* Action Checkmarks Panel */}
        <div className="flex flex-col gap-1.5 bg-[#f1f5f9] p-4 rounded-[12px] border border-[#e2e8f0] font-mono text-[12px]">
          <div className="flex items-center gap-2 text-[#020520]">
            <span className="material-symbols-outlined text-[#16ca2e] text-[16px]">check_circle</span>
            <span>Re-scanning DOM: Success</span>
          </div>
          <div className="flex items-center gap-2 text-[#020520]">
            <span className="material-symbols-outlined text-[#16ca2e] text-[16px]">check_circle</span>
            <span>Normalizing Data: Success</span>
          </div>
          <div className="flex items-center gap-2 text-[#020520]">
            <span className="material-symbols-outlined text-[#16ca2e] text-[16px]">check_circle</span>
            <span>Checking for Changes: Complete (No changes found)</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 border-t border-[#e2e8f0]">
          <button
            onClick={() => navigate("/intelligence")}
            className="w-full sm:w-auto bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] font-inter font-medium text-[14px] px-6 py-2 rounded-full transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            View Intelligence Update
          </button>

          <button
            onClick={() => navigate("/scrapers")}
            className="w-full sm:w-auto bg-[#ffffff] border border-[#e2e8f0] text-[#020520] hover:bg-[#f0f4fe] font-inter font-medium text-[14px] px-6 py-2 rounded-full transition-colors duration-150 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Scraper Health
          </button>
        </div>
      </div>

      {/* Propagating message */}
      <div className="mt-8 flex items-center gap-2 text-[#6b7280]">
        <div className="w-2 h-2 rounded-full bg-[#16ca2e]"></div>
        <p className="font-mono text-xs">Propagating recovered data to Executive Dashboard...</p>
      </div>
    </main>
  );
};

