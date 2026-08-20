import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changeDetails } from "../mockData";

export const ChangeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Retrieve details from mock dataset or fall back to default
  const detailKey = id && changeDetails[id] ? id : "openai-restructure";
  const detail = changeDetails[detailKey];

  return (
    <main className="flex-1 overflow-y-auto bg-background flex flex-col">
      {/* Top Navigation / Contextual Back Header */}
      <header className="sticky top-0 w-full z-30 bg-canvas-white/90 backdrop-blur-md border-b border-hairline h-14 px-margin-mobile md:px-margin-desktop flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-sm">
          <button
            onClick={() => navigate("/intelligence")}
            className="hover:bg-surface-container-low rounded-full p-xs transition-colors text-secondary flex items-center justify-center active:scale-[0.98]"
            aria-label="Back to Market Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="font-body-strong text-ink text-[14px]">Back to Intelligence Feed</span>
        </div>

        <div className="flex items-center gap-md">
          <button
            onClick={() => alert(`Team alert initiated for ${detail.vendorName}`)}
            className="px-md py-1.5 rounded-full border border-hairline bg-surface-pearl text-ink font-body-strong hover:bg-surface-container-low active:scale-[0.98] transition-all text-[12px]"
          >
            Alert Team
          </button>
        </div>
      </header>

      {/* Main Canvas Container */}
      <div className="w-full p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto space-y-xl">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-xs mb-xs">
            <span className="w-2 h-2 rounded-full bg-warning-amber"></span>
            <span className="font-label-capsule text-secondary text-[12px]">{detail.timeText}</span>
          </div>
          <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-ink mb-xs tracking-tight">
            {detail.title}
          </h1>
          <p className="font-body text-[16px] text-secondary max-w-3xl leading-relaxed">
            {detail.subtitle}
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-lg">
            {/* The Context (AI Synthesis Card) */}
            <section className="bg-canvas-white border border-hairline rounded-xl p-lg relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-sm opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[100px]">psychology</span>
              </div>
              <h2 className="font-tagline text-[18px] text-ink font-semibold mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                The Context
              </h2>
              <div className="text-secondary font-body text-[14px] leading-relaxed space-y-sm">
                <p>{detail.contextText}</p>
                <div className="font-body-strong text-ink text-[13px] pt-xs">Key drivers analyzed:</div>
                <ul className="list-disc pl-md space-y-xs text-secondary text-[13px]">
                  {detail.keyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Plan Structure Diff Table */}
            <section className="bg-canvas-white border border-hairline rounded-xl overflow-hidden shadow-sm">
              <div className="bg-canvas-parchment p-md border-b border-hairline flex justify-between items-center">
                <h3 className="font-body-strong text-[15px] text-ink font-semibold">Plan Structure Diff</h3>
                <div className="flex gap-sm">
                  <span className="px-sm py-xxs rounded-full text-[11px] font-semibold tracking-wider uppercase bg-surface-container-high text-secondary">
                    Previous
                  </span>
                  <span className="px-sm py-xxs rounded-full text-[11px] font-semibold tracking-wider uppercase bg-primary-container/20 text-primary font-bold">
                    Current
                  </span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-data-tabular text-[13px]">
                  <thead>
                    <tr className="bg-surface-container-low text-secondary font-label-capsule text-[11px] uppercase border-b border-hairline">
                      <th className="p-sm font-medium">Metric / Feature</th>
                      <th className="p-sm font-medium w-1/3">Previous State</th>
                      <th className="p-sm font-medium w-1/3">New State (Current)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {detail.metrics.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-surface-pearl transition-colors">
                        <td className="p-sm font-medium text-ink">{metric.name}</td>
                        <td className="p-sm text-error line-through bg-error-container/20">
                          {metric.previous}
                        </td>
                        <td className={`p-sm font-medium ${
                          metric.status === "critical"
                            ? "bg-error-container/30 text-critical-red font-semibold"
                            : "bg-success-green/10 text-success-green font-semibold"
                        }`}>
                          {metric.current}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-lg">
            {/* Financial Impact Card */}
            <section className="bg-inverse-surface text-canvas-white rounded-xl p-lg shadow-md relative overflow-hidden">
              <h3 className="font-body-strong text-[14px] mb-sm text-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                Estimated Impact
              </h3>

              <div className="mb-lg">
                <div className="text-[11px] text-surface-dim uppercase tracking-wider mb-xxs">
                  Projected Monthly Delta
                </div>
                <div className="font-display-lg text-[32px] font-bold text-success-green flex items-baseline gap-xs">
                  {detail.monthlyDelta}
                  <span className="text-[12px] text-surface-dim font-normal">/mo</span>
                </div>
                <p className="font-nav-link text-[11px] text-secondary mt-xs">
                  Based on trailing 30-day usage.
                </p>
              </div>

              <div className="space-y-sm mb-lg text-[13px] font-data-tabular">
                <div className="flex justify-between items-center border-b border-secondary/30 pb-xs">
                  <span className="text-secondary">Current Spend (Est)</span>
                  <span>{detail.spendAvg}</span>
                </div>
                <div className="flex justify-between items-center border-b border-secondary/30 pb-xs">
                  <span className="text-secondary">New Spend (Est)</span>
                  <span className="font-semibold text-canvas-white">{detail.runRate}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/intelligence/financial-impact")}
                className="w-full py-2.5 bg-primary hover:bg-primary-container text-white rounded-full font-body-strong text-[13px] active:scale-[0.98] transition-all flex justify-center items-center gap-xs shadow-sm"
              >
                <span>Update Budget Forecast</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </section>

            {/* Action Bar */}
            <section className="bg-canvas-white border border-hairline rounded-xl p-md flex flex-col gap-sm shadow-sm">
              <button
                onClick={() => alert("Initiating vendor negotiation flow...")}
                className="w-full py-2.5 px-md rounded-full bg-primary text-on-primary font-body-strong text-[13px] hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">handshake</span>
                <span>Initiate Negotiation</span>
              </button>

              <button
                onClick={() => alert("Alerting procurement team...")}
                className="w-full py-2 px-md rounded-full border border-hairline bg-surface-pearl text-ink font-body-strong text-[13px] hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">group_add</span>
                <span>Alert Team</span>
              </button>

              <button
                onClick={() => navigate("/alerts")}
                className="w-full py-2 px-md rounded-full bg-transparent text-primary font-body-strong text-[13px] hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">snooze</span>
                <span>Snooze Alert</span>
              </button>
            </section>

            {/* Scraper Status Validation Badge */}
            <div className="flex items-center gap-sm text-[12px] text-secondary bg-surface-container-low p-sm rounded-lg border border-hairline font-data-tabular">
              <span className="material-symbols-outlined text-success-green text-[18px]">check_circle</span>
              <span>Scraper Validation: High Confidence ({detail.confidenceScore})</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
