import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changeDetails } from "../mockData";

export const ChangeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detailKey = id && changeDetails[id] ? id : "openai-restructure";
  const detail = changeDetails[detailKey];

  return (
    <main className="flex-1 overflow-y-auto bg-[#fcfcfc] flex flex-col">
      {/* Top Navigation / Contextual Back Header */}
      <header className="sticky top-0 w-full z-30 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e2e8f0] h-14 px-4 md:px-10 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/intelligence")}
            className="hover:bg-[#f0f4fe] rounded-full p-1.5 transition-colors text-[#374151] flex items-center justify-center"
            aria-label="Back to Market Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="font-inter font-semibold text-[#020520] text-[14px]">Back to Intelligence Feed</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Team alert initiated for ${detail.vendorName}`)}
            className="px-4 py-1.5 rounded-full border border-[#145aff] bg-[#fcfcfc] text-[#145aff] font-inter font-medium hover:bg-[#f0f4fe] transition-colors text-[12px]"
          >
            Alert Team
          </button>
        </div>
      </header>

      {/* Main Canvas Container */}
      <div className="w-full p-4 md:p-10 max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ffa64d]"></span>
            <span className="font-mono text-[#6b7280] text-[12px]">{detail.timeText}</span>
          </div>
          <h1 className="font-inter text-[32px] md:text-[40px] font-semibold text-[#020520] mb-1 tracking-[-1.48px] leading-tight">
            {detail.title}
          </h1>
          <p className="font-inter text-[16px] text-[#374151] max-w-3xl leading-relaxed">
            {detail.subtitle}
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* The Context (AI Synthesis Card) */}
            <section className="bg-[#f0f4fe]/60 border border-[#e2e8f0] rounded-[16px] p-6 relative overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-[#145aff]">
                <span className="material-symbols-outlined text-[100px]">psychology</span>
              </div>
              <h2 className="font-inter text-[18px] text-[#020520] font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#145aff]">auto_awesome</span>
                The Context
              </h2>
              <div className="text-[#374151] font-inter text-[14px] leading-relaxed space-y-3">
                <p>{detail.contextText}</p>
                <div className="font-semibold text-[#020520] text-[13px] pt-1">Key drivers analyzed:</div>
                <ul className="list-disc pl-5 space-y-1 text-[#374151] text-[13px]">
                  {detail.keyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Plan Structure Diff Table */}
            <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="bg-[#f1f5f9] p-4 border-b border-[#e2e8f0] flex justify-between items-center">
                <h3 className="font-inter text-[15px] text-[#020520] font-semibold">Plan Structure Diff</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[#e2e8f0] text-[#374151]">
                    Previous
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[#145aff]/10 text-[#145aff] font-semibold">
                    Current
                  </span>
                </div>
              </div>

              <div className="w-full overflow-x-auto font-mono text-[13px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f1f5f9] text-[#374151] font-inter text-[11px] uppercase border-b border-[#e2e8f0]">
                      <th className="p-3 font-medium">Metric / Feature</th>
                      <th className="p-3 font-medium w-1/3">Previous State</th>
                      <th className="p-3 font-medium w-1/3">New State (Current)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {detail.metrics.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-[#f0f4fe]/60 transition-colors duration-150">
                        <td className="p-3 font-inter font-medium text-[#020520]">{metric.name}</td>
                        <td className="p-3 text-[#f26052] line-through bg-[#f26052]/5">
                          {metric.previous}
                        </td>
                        <td className={`p-3 font-semibold ${
                          metric.status === "critical"
                            ? "bg-[#f26052]/10 text-[#f26052]"
                            : "bg-[#16ca2e]/10 text-[#16ca2e]"
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
            <section className="bg-[#020520] text-white rounded-[16px] p-6 shadow-md relative overflow-hidden">
              <h3 className="font-inter text-[14px] mb-2 text-[#e2e8f0] flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[18px] text-[#145aff]">account_balance_wallet</span>
                Estimated Impact
              </h3>

              <div className="mb-6">
                <div className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1 font-mono">
                  Projected Monthly Delta
                </div>
                <div className="font-mono text-[32px] font-semibold text-[#16ca2e] flex items-baseline gap-1">
                  {detail.monthlyDelta}
                  <span className="text-[12px] text-[#6b7280] font-normal">/mo</span>
                </div>
                <p className="font-inter text-[11px] text-[#6b7280] mt-1">
                  Based on trailing 30-day usage.
                </p>
              </div>

              <div className="space-y-2 mb-6 text-[13px] font-mono">
                <div className="flex justify-between items-center border-b border-[#e2e8f0]/20 pb-2">
                  <span className="text-[#6b7280]">Current Spend (Est)</span>
                  <span>{detail.spendAvg}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#e2e8f0]/20 pb-2">
                  <span className="text-[#6b7280]">New Spend (Est)</span>
                  <span className="font-semibold text-white">{detail.runRate}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/intelligence/financial-impact")}
                className="w-full py-2.5 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] rounded-full font-inter font-medium text-[13px] transition-colors duration-150 flex justify-center items-center gap-1.5 shadow-sm"
              >
                <span>Update Budget Forecast</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </section>

            {/* Action Bar */}
            <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 flex flex-col gap-3 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <button
                onClick={() => alert("Initiating vendor negotiation flow...")}
                className="w-full py-2.5 px-4 rounded-full bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">handshake</span>
                <span>Initiate Negotiation</span>
              </button>

              <button
                onClick={() => alert("Alerting procurement team...")}
                className="w-full py-2 px-4 rounded-full border border-[#e2e8f0] bg-[#ffffff] text-[#020520] font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">group_add</span>
                <span>Alert Team</span>
              </button>

              <button
                onClick={() => navigate("/alerts")}
                className="w-full py-2 px-4 rounded-full bg-transparent text-[#145aff] font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">snooze</span>
                <span>Snooze Alert</span>
              </button>
            </section>

            {/* Scraper Status Validation Badge */}
            <div className="flex items-center gap-2 text-[12px] text-[#374151] bg-[#f1f5f9] p-3 rounded-[12px] border border-[#e2e8f0] font-mono">
              <span className="material-symbols-outlined text-[#16ca2e] text-[18px]">check_circle</span>
              <span>Scraper Validation: High Confidence ({detail.confidenceScore})</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

