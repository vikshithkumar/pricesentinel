import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changeDetails } from "../mockData";

export const ChangeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detailKey = id && changeDetails[id] ? id : "openai-restructure";
  const detail = changeDetails[detailKey];

  return (
    <main className="flex-1 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col font-dm-sans transition-colors duration-200">
      {/* Top Navigation / Contextual Back Header */}
      <header className="sticky top-4 z-30 mx-4 md:mx-6 my-2 bg-white/80 dark:bg-[#161616]/80 backdrop-blur-xl border border-bone-light dark:border-white/10 rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm dark:shadow-glass shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/intelligence")}
            className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-1.5 transition-colors text-steel dark:text-ash hover:text-carbon dark:hover:text-white flex items-center justify-center"
            aria-label="Back to Market Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="font-dm-sans font-medium text-carbon dark:text-bone text-[14px]">Back to Intelligence Feed</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Team alert initiated for ${detail.vendorName}`)}
            className="px-4 py-1.5 rounded-full border border-bone-light dark:border-white/20 bg-vapor dark:bg-white/5 text-carbon dark:text-bone font-dm-sans font-medium hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors text-[12px]"
          >
            Alert Team
          </button>
        </div>
      </header>

      {/* Main Canvas Container */}
      <div className="w-full p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
            <span className="font-geist text-steel dark:text-slate text-[12px] uppercase tracking-wider">{detail.timeText}</span>
          </div>
          <h1 className="font-geist text-[32px] md:text-[36px] font-medium text-ink-black dark:text-bone mb-2 tracking-tight leading-tight">
            {detail.title}
          </h1>
          <p className="font-dm-sans text-[15px] text-steel dark:text-ash max-w-3xl leading-relaxed">
            {detail.subtitle}
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* The Context (AI Synthesis Card) */}
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 relative overflow-hidden shadow-sm dark:shadow-glass">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-carbon dark:text-white">
                <span className="material-symbols-outlined text-[100px]">psychology</span>
              </div>
              <h2 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-4 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center text-carbon dark:text-bone">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                </div>
                The Context
              </h2>
              <div className="text-steel dark:text-ash font-dm-sans text-[14px] leading-relaxed space-y-3">
                <p>{detail.contextText}</p>
                <div className="font-geist font-medium text-ink-black dark:text-bone text-[14px] pt-2">Key drivers analyzed:</div>
                <ul className="list-disc pl-5 space-y-1.5 text-steel dark:text-ash text-[13px]">
                  {detail.keyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Plan Structure Diff Table */}
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm dark:shadow-glass">
              <div className="bg-vapor/50 dark:bg-white/[0.02] p-5 border-b border-bone-light dark:border-white/10 flex justify-between items-center">
                <h3 className="font-geist text-[16px] text-ink-black dark:text-bone font-medium">Plan Structure Diff</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-geist uppercase bg-vapor text-steel border border-bone-light dark:bg-white/5 dark:text-ash dark:border-white/10">
                    Previous
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-geist uppercase bg-signal-blue/15 text-signal-blue border border-signal-blue/30 dark:bg-white/15 dark:text-white font-medium dark:border-white/20">
                    Current
                  </span>
                </div>
              </div>

              <div className="w-full overflow-x-auto font-dm-sans text-[13px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-vapor dark:bg-white/[0.01] text-steel dark:text-ash font-dm-sans text-[11px] uppercase border-b border-bone-light dark:border-white/10 tracking-wider">
                      <th className="p-4 font-medium">Metric / Feature</th>
                      <th className="p-4 font-medium w-1/3">Previous State</th>
                      <th className="p-4 font-medium w-1/3">New State (Current)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone-light/60 dark:divide-white/5 text-carbon dark:text-bone">
                    {detail.metrics.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors duration-150">
                        <td className="p-4 font-geist font-medium text-ink-black dark:text-bone">{metric.name}</td>
                        <td className="p-4 text-red-600 dark:text-red-400 line-through bg-red-500/5 font-geist">
                          {metric.previous}
                        </td>
                        <td className={`p-4 font-geist font-medium ${
                          metric.status === "critical"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
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
          <div className="lg:col-span-4 space-y-6">
            {/* Financial Impact Card */}
            <section className="bg-white dark:bg-[#161616] text-carbon dark:text-bone rounded-[24px] border border-bone-light dark:border-white/10 p-6 shadow-sm dark:shadow-glass relative overflow-hidden">
              <h3 className="font-geist text-[15px] mb-3 text-steel dark:text-ash flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-[18px] text-signal-blue dark:text-white">account_balance_wallet</span>
                Estimated Impact
              </h3>

              <div className="mb-6">
                <div className="text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-1 font-geist">
                  Projected Monthly Delta
                </div>
                <div className="font-geist text-[34px] font-medium text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1">
                  {detail.monthlyDelta}
                  <span className="text-[13px] text-steel dark:text-ash font-normal font-dm-sans">/mo</span>
                </div>
                <p className="font-dm-sans text-[12px] text-steel dark:text-ash mt-1">
                  Based on trailing 30-day usage.
                </p>
              </div>

              <div className="space-y-3 mb-6 text-[13px] font-geist">
                <div className="flex justify-between items-center border-b border-bone-light dark:border-white/10 pb-2.5">
                  <span className="text-steel dark:text-ash">Current Spend (Est)</span>
                  <span className="text-carbon dark:text-bone">{detail.spendAvg}</span>
                </div>
                <div className="flex justify-between items-center border-b border-bone-light dark:border-white/10 pb-2.5">
                  <span className="text-steel dark:text-ash">New Spend (Est)</span>
                  <span className="font-medium text-ink-black dark:text-white">{detail.runRate}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/intelligence/financial-impact")}
                className="w-full py-2.5 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-full font-dm-sans font-medium text-[13px] transition-all duration-150 flex justify-center items-center gap-2 shadow-sm"
              >
                <span>Update Budget Forecast</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </section>

            {/* Action Bar */}
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 flex flex-col gap-3 shadow-sm dark:shadow-glass">
              <button
                onClick={() => alert("Initiating vendor negotiation flow...")}
                className="w-full py-2.5 px-4 rounded-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/15 text-carbon dark:text-bone font-dm-sans font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Initiate Negotiation</span>
              </button>

              <button
                onClick={() => alert("Alerting procurement team...")}
                className="w-full py-2.5 px-4 rounded-full border border-bone-light dark:border-white/10 bg-transparent text-carbon dark:text-bone font-dm-sans text-[13px] hover:bg-vapor dark:hover:bg-white/5 transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">group_add</span>
                <span>Alert Team</span>
              </button>

              <button
                onClick={() => navigate("/alerts")}
                className="w-full py-2 px-4 rounded-full bg-transparent text-steel dark:text-ash font-dm-sans text-[13px] hover:text-carbon dark:hover:text-white transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">snooze</span>
                <span>Snooze Alert</span>
              </button>
            </section>

            {/* Scraper Status Validation Badge */}
            <div className="flex items-center gap-2.5 text-[12px] text-steel dark:text-ash bg-white/90 dark:bg-white/5 p-4 rounded-full border border-bone-light dark:border-white/10 font-geist shadow-sm dark:shadow-glass">
              <span className="material-symbols-outlined text-emerald-500 dark:text-emerald-400 text-[18px]">check_circle</span>
              <span>Scraper Validation: High Confidence ({detail.confidenceScore})</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};



