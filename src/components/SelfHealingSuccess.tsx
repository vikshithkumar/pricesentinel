import React from "react";
import { useNavigate } from "react-router-dom";

export const SelfHealingSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop bg-background relative overflow-hidden">
      {/* Breadcrumb nav */}
      <nav className="absolute top-0 left-0 w-full p-lg z-30 flex items-center gap-xs text-sm font-body">
        <span className="text-secondary">Dashboard</span>
        <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
        <span className="text-secondary">Scraper Health</span>
        <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
        <span className="text-secondary">OpenAI</span>
        <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
        <span className="text-secondary">Self-Healing Lab</span>
        <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
        <span className="text-secondary">Success</span>
        <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
        <span className="text-ink font-semibold">Propagation</span>
      </nav>

      {/* Atmospheric radial gradient effect matching Stitch */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-success-green/5 via-background to-background opacity-60"></div>

      {/* Success Recovery Card */}
      <div className="w-full max-w-3xl bg-canvas-parchment rounded-xl border border-hairline p-lg md:p-xl flex flex-col gap-lg shadow-[0px_10px_40px_rgba(0,0,0,0.04)] relative z-10 animate-fade-in">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-xs">
          <div className="w-16 h-16 rounded-full bg-success-green/10 flex items-center justify-center text-success-green mb-xxs">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h2 className="font-hero-display text-[26px] md:text-[34px] font-bold text-ink tracking-tight">
            SCRAPER RECOVERED
          </h2>
          <p className="font-body text-secondary max-w-xl text-[14px] leading-relaxed">
            The visual DOM mapping was successfully repaired. Sentinel AI has synchronized the new extraction logic across all scraper nodes. Real-time monitoring has resumed.
          </p>
        </div>

        {/* Metadata Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline rounded-lg overflow-hidden border border-hairline bg-canvas-white">
          {/* Vendor */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Vendor</span>
            <span className="font-body-strong text-body-strong text-ink">OpenAI</span>
          </div>
          {/* Status */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Status</span>
            <span className="font-body-strong text-body-strong text-success-green flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync
              </span>
              Synchronized
            </span>
          </div>
          {/* Last Verified */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Last Verified</span>
            <span className="font-data-tabular text-ink font-semibold">10 seconds ago</span>
          </div>
          {/* Recovery Time */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Recovery Time</span>
            <span className="font-data-tabular text-ink font-semibold">18.4 seconds</span>
          </div>
          {/* Fields Recovered */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Fields Recovered</span>
            <span className="font-body-strong text-body-strong text-ink">12 / 12</span>
          </div>
          {/* Validation */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Validation</span>
            <span className="font-body-strong text-body-strong text-success-green">Passed</span>
          </div>
          {/* Data Quality */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Data Quality</span>
            <span className="font-body-strong text-body-strong text-ink">100%</span>
          </div>
          {/* Confidence */}
          <div className="p-md bg-canvas-white flex flex-col justify-center">
            <span className="font-data-tabular text-[10px] text-secondary uppercase font-semibold tracking-wider mb-1">Confidence</span>
            <span className="font-body-strong text-body-strong text-ink">96.4%</span>
          </div>
        </div>

        {/* Action Checkmarks Panel */}
        <div className="flex flex-col gap-xs bg-surface-container-low p-md rounded-lg border border-hairline">
          <div className="flex items-center gap-xs text-[13px] text-ink">
            <span className="material-symbols-outlined text-success-green text-[16px]">check_circle</span>
            <span>Re-scanning DOM: Success</span>
          </div>
          <div className="flex items-center gap-xs text-[13px] text-ink">
            <span className="material-symbols-outlined text-success-green text-[16px]">check_circle</span>
            <span>Normalizing Data: Success</span>
          </div>
          <div className="flex items-center gap-xs text-[13px] text-ink">
            <span className="material-symbols-outlined text-success-green text-[16px]">check_circle</span>
            <span>Checking for Changes: Complete (No changes found)</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-md pt-sm border-t border-hairline mt-xxs">
          <button
            onClick={() => navigate("/intelligence")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-on-primary font-body-strong text-[14px] px-xl py-sm rounded-full transition-all flex items-center justify-center gap-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            View Intelligence Update
          </button>

          <button
            onClick={() => navigate("/scrapers")}
            className="w-full sm:w-auto bg-surface-pearl border border-hairline text-ink hover:bg-surface-container font-body-strong text-[14px] px-xl py-sm rounded-full transition-all flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Scraper Health
          </button>
        </div>

      </div>

      {/* Propagating message */}
      <div className="mt-xl flex items-center gap-sm text-secondary animate-pulse">
        <div className="w-2 h-2 rounded-full bg-success-green"></div>
        <p className="font-body text-sm">Propagating recovered data to Executive Dashboard...</p>
      </div>
    </main>
  );
};
