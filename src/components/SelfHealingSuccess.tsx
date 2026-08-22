import React from "react";
import { useNavigate } from "react-router-dom";

export const SelfHealingSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8 bg-frost dark:bg-[#0a0a0a] relative overflow-y-auto w-full max-w-[1400px] mx-auto min-h-full font-dm-sans transition-colors duration-200">
      {/* Success Recovery Card */}
      <div className="w-full max-w-3xl bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 p-6 md:p-10 flex flex-col gap-6 shadow-sm dark:shadow-glass relative z-10 my-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>
          <h2 className="font-geist text-[26px] md:text-[34px] font-medium text-ink-black dark:text-bone tracking-tight">
            SCRAPER RECOVERED
          </h2>
          <p className="font-dm-sans text-steel dark:text-ash max-w-xl text-[14px] leading-relaxed">
            The visual DOM mapping was successfully repaired. Sentinel AI has synchronized the new extraction logic across all scraper nodes. Real-time monitoring has resumed.
          </p>
        </div>

        {/* Metadata Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone-light dark:bg-white/10 rounded-[16px] overflow-hidden border border-bone-light dark:border-white/10 font-geist">
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Vendor</span>
            <span className="font-medium text-ink-black dark:text-bone">OpenAI</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Status</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                sync
              </span>
              Synchronized
            </span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Last Verified</span>
            <span className="text-ink-black dark:text-bone font-medium">10 seconds ago</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Recovery Time</span>
            <span className="text-ink-black dark:text-bone font-medium">18.4 seconds</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Fields Recovered</span>
            <span className="font-medium text-ink-black dark:text-bone">12 / 12</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Validation</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Passed</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Data Quality</span>
            <span className="font-medium text-ink-black dark:text-bone">100%</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#161616] flex flex-col justify-center">
            <span className="text-[10px] text-steel dark:text-slate uppercase font-medium tracking-wider mb-1">Confidence</span>
            <span className="font-medium text-ink-black dark:text-bone">96.4%</span>
          </div>
        </div>

        {/* Action Checkmarks Panel */}
        <div className="flex flex-col gap-2 bg-vapor dark:bg-white/5 p-4 rounded-[16px] border border-bone-light dark:border-white/10 font-geist text-[12px]">
          <div className="flex items-center gap-2 text-carbon dark:text-bone">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[16px]">check_circle</span>
            <span>Re-scanning DOM: Success</span>
          </div>
          <div className="flex items-center gap-2 text-carbon dark:text-bone">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[16px]">check_circle</span>
            <span>Normalizing Data: Success</span>
          </div>
          <div className="flex items-center gap-2 text-carbon dark:text-bone">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[16px]">check_circle</span>
            <span>Checking for Changes: Complete (No changes found)</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 border-t border-bone-light dark:border-white/10 font-dm-sans">
          <button
            onClick={() => navigate("/intelligence")}
            className="w-full sm:w-auto bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black font-dm-sans font-medium text-[14px] px-6 py-2.5 rounded-full dark:hover:bg-neutral-200 transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            View Intelligence Update
          </button>

          <button
            onClick={() => navigate("/scrapers")}
            className="w-full sm:w-auto bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone hover:bg-[#e4e4e7] dark:hover:bg-white/10 font-dm-sans font-medium text-[14px] px-6 py-2.5 rounded-full transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Scraper Health
          </button>
        </div>
      </div>

      {/* Propagating message */}
      <div className="mt-8 flex items-center gap-2 text-steel dark:text-slate">
        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
        <p className="font-geist text-xs">Propagating recovered data to Executive Dashboard...</p>
      </div>
    </main>
  );
};



