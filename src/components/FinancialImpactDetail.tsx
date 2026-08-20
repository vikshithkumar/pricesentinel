import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mockFinancialImpactScores } from "../mockData";

export const FinancialImpactDetail: React.FC = () => {
  const [seatCount, setSeatCount] = useState<number>(1250);
  const [monthlySpend, setMonthlySpend] = useState<number>(350000);
  const [renewalDate, setRenewalDate] = useState<string>("2024-12-31");

  const [appliedSeats, setAppliedSeats] = useState<number>(1250);
  const [appliedMonthlySpend, setAppliedMonthlySpend] = useState<number>(350000);

  const currentAnnualSpend = appliedMonthlySpend * 12;
  const seatsDelta = appliedSeats - 1250;
  const spendAdjustment = seatsDelta * 360;
  const totalDelta = 450000 + spendAdjustment;
  const projectedSpend = currentAnnualSpend + totalDelta;
  const renewalExposure = 1200000;

  const formatCurrency = (val: number) => {
    const sign = val < 0 ? "-" : "";
    const absVal = Math.abs(val);
    if (absVal >= 1000000) {
      return `${sign}$${(absVal / 1000000).toFixed(2)}M`;
    }
    return `${sign}$${(absVal / 1000).toFixed(0)}k`;
  };

  const handleApply = () => {
    setAppliedSeats(seatCount);
    setAppliedMonthlySpend(monthlySpend);
  };

  const handleReset = () => {
    setSeatCount(1250);
    setMonthlySpend(350000);
    setRenewalDate("2024-12-31");
    setAppliedSeats(1250);
    setAppliedMonthlySpend(350000);
  };

  return (
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-4 font-inter text-[12px] text-[#6b7280]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#145aff] transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Intelligence</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Financial Impact</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">
            Financial Impact Analysis
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-[#6b7280] font-mono text-[12px]">
            <span className="material-symbols-outlined text-[16px]">update</span>
            Last Calculated: Today, 09:41 AM EST
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#fcfcfc] border border-[#e2e8f0] text-[#020520] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150">
            Export CSV
          </button>
          <button className="px-5 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            Generate Procurement Report
          </button>
        </div>
      </div>

      {/* Stale Data Warning Banner */}
      <div className="mb-6 bg-[#ffffff] border border-[#ffa64d]/40 rounded-[16px] p-4 flex items-start gap-3 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        <span className="material-symbols-outlined text-[#ffa64d] mt-[2px] text-[20px]">warning</span>
        <div>
          <h4 className="font-inter text-[14px] text-[#020520] font-semibold">Stale Data Warning</h4>
          <p className="font-inter text-[#374151] text-[13px] mt-0.5">
            Scraper health for 2 vendors (Salesforce, Zendesk) is currently degraded. Projections may rely on historical data older than 48 hours.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-grow">

        {/* Left Column */}
        <div className="col-span-1 lg:col-span-8 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Current Annual Spend</div>
              <div className="font-mono text-[28px] font-semibold text-[#020520]">{formatCurrency(currentAnnualSpend)}</div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 relative overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Projected Annual Spend</div>
              <div className="font-mono text-[28px] font-semibold text-[#020520]">{formatCurrency(projectedSpend)}</div>
              <div className="absolute top-3 right-3 flex items-center gap-0.5 text-[#f26052] font-mono text-[11px] bg-[#f26052]/10 px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +{((totalDelta / currentAnnualSpend) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Total Delta</div>
              <div className={`font-mono text-[28px] font-semibold ${totalDelta >= 0 ? "text-[#f26052]" : "text-[#16ca2e]"}`}>
                {totalDelta >= 0 ? "+" : ""}{formatCurrency(totalDelta)}
              </div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Renewal Exp. (90d)</div>
              <div className="font-mono text-[28px] font-semibold text-[#020520]">{formatCurrency(renewalExposure)}</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 h-64 flex flex-col shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="font-inter text-[15px] text-[#020520] font-semibold mb-3">Cost Variance Trend</div>
              <div className="flex-grow flex items-end justify-between px-4 pb-2 bg-[#f1f5f9] rounded-[12px] border border-[#e2e8f0] relative">
                <div className="absolute top-2 left-2 text-[10px] text-[#6b7280] font-mono">Monthly Variance ($k)</div>
                <div className="w-full flex justify-between items-end h-[80%] px-2">
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#3b82f6]/40 h-8 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">Mar</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#3b82f6]/40 h-10 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">Apr</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#3b82f6]/40 h-7 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">May</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#3b82f6]/40 h-12 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">Jun</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#ffa64d]/80 h-20 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">Jul</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-[#f26052] h-28 rounded-t-sm"></div>
                    <span className="text-[10px] text-[#6b7280] font-mono mt-1">Aug</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 h-64 flex flex-col shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="font-inter text-[15px] text-[#020520] font-semibold mb-3">Spend by Category</div>
              <div className="flex-grow flex items-center justify-center bg-[#f1f5f9] rounded-[12px] border border-[#e2e8f0] relative">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#145aff" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="100" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffa64d" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="60" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#16ca2e" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="30" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f26052" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="10" />
                  <circle cx="18" cy="18" r="12" fill="#fcfcfc" />
                </svg>
                <div className="absolute right-4 top-4 flex flex-col gap-1 text-[10px] font-mono text-[#374151]">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#145aff]"></span> Infra (40%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ffa64d]"></span> CRM (30%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16ca2e]"></span> DevTools (20%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f26052]"></span> AI (10%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <div className="p-4 border-b border-[#e2e8f0] bg-[#f1f5f9] flex justify-between items-center">
              <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Vendor Impact Scoring</h3>
            </div>
            <div className="overflow-x-auto font-mono text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] font-inter text-[#374151]">
                    <th className="py-3 px-4 text-[12px] font-medium uppercase">Vendor</th>
                    <th className="py-3 px-4 text-[12px] font-medium uppercase">Impact Score</th>
                    <th className="py-3 px-4 text-[12px] font-medium uppercase">Core Drivers</th>
                    <th className="py-3 px-4 text-[12px] font-medium uppercase text-right">Annual Delta</th>
                    <th className="py-3 px-4 text-[12px] font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#14141e]">
                  {mockFinancialImpactScores.map((scoreItem) => (
                    <tr key={scoreItem.vendor} className="hover:bg-[#f0f4fe]/60 transition-colors duration-150">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${scoreItem.impactColor === "red" ? "bg-[#f26052]" :
                            scoreItem.impactColor === "amber" ? "bg-[#ffa64d]" : "bg-[#16ca2e]"
                          }`}></div>
                        <span className="font-inter font-semibold text-[#020520]">{scoreItem.vendor}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div className={`h-full ${scoreItem.impactColor === "red" ? "bg-[#f26052]" :
                                scoreItem.impactColor === "amber" ? "bg-[#ffa64d]" : "bg-[#16ca2e]"
                              }`} style={{ width: `${scoreItem.score}%` }}></div>
                          </div>
                          <span>{scoreItem.score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-inter text-[#374151]">{scoreItem.coreDrivers}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${scoreItem.impactColor === "red" ? "text-[#f26052]" :
                          scoreItem.impactColor === "amber" ? "text-[#ffa64d]" : "text-[#16ca2e]"
                        }`}>{scoreItem.annualDelta}</td>
                      <td className="py-3 px-4 font-inter">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f0f4fe] text-[#145aff] text-[11px] font-medium">
                          {scoreItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Config Overrides Panel */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 sticky top-20 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
              <h3 className="font-inter text-[#020520] flex items-center gap-2 font-semibold text-[15px]">
                <span className="material-symbols-outlined text-[20px] text-[#145aff]">tune</span>
                Profile Overrides
              </h3>
              <button
                onClick={handleReset}
                className="text-[#145aff] text-[13px] hover:underline font-inter font-medium"
              >
                Reset
              </button>
            </div>
            <p className="font-inter text-[#374151] text-[13px] mb-6 leading-relaxed">
              Refine calculations by overriding Sentinel's detected company metrics.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-inter text-[12px] text-[#374151] mb-1 font-medium">Total Seat Count</label>
                <div className="flex relative">
                  <input
                    className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] py-2 px-3 font-mono text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] pr-12 transition-colors"
                    type="number"
                    value={seatCount}
                    onChange={(e) => setSeatCount(parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider text-[#145aff] font-semibold">User</span>
                </div>
              </div>

              <div>
                <label className="block font-inter text-[12px] text-[#374151] mb-1 font-medium">Avg. Monthly Cloud Spend</label>
                <div className="flex relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] font-mono text-[13px]">$</span>
                  <input
                    className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] py-2 pl-7 pr-20 font-mono text-[13px] text-[#6b7280] focus:outline-none cursor-not-allowed"
                    type="text"
                    disabled={true}
                    value={appliedMonthlySpend.toLocaleString()}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider text-[#6b7280] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Sentinel
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-inter text-[12px] text-[#374151] mb-1 font-medium">Global Renewal Anchor Date</label>
                <input
                  className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] py-2 px-3 font-mono text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-colors"
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e2e8f0]">
              <button
                onClick={handleApply}
                className="w-full bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] rounded-full font-inter font-medium text-[13px] py-2 transition-colors duration-150 shadow-sm"
              >
                Apply Overrides
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

