import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mockFinancialImpactScores } from "../mockData";

export const FinancialImpactDetail: React.FC = () => {
  // Overrides form state
  const [seatCount, setSeatCount] = useState<number>(1250);
  const [monthlySpend, setMonthlySpend] = useState<number>(350000);
  const [renewalDate, setRenewalDate] = useState<string>("2024-12-31");

  // Visual calculation state
  const [appliedSeats, setAppliedSeats] = useState<number>(1250);
  const [appliedMonthlySpend, setAppliedMonthlySpend] = useState<number>(350000);

  const currentAnnualSpend = appliedMonthlySpend * 12;

  // Calculate projected spend dynamically based on overrides for high-fidelity interaction
  const seatsDelta = appliedSeats - 1250;
  const spendAdjustment = seatsDelta * 360; // Adjust $360/year per seat change
  const totalDelta = 450000 + spendAdjustment;
  const projectedSpend = currentAnnualSpend + totalDelta;
  const renewalExposure = 1200000; // $1.2M

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
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs mb-md text-nav-link font-nav-link animate-fade-in" aria-label="Breadcrumb">
        <Link to="/" className="text-secondary hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-secondary">Intelligence</span>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-ink font-medium">Financial Impact</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-ink font-bold tracking-tight">
            Financial Impact Analysis
          </h1>
          <div className="flex items-center gap-xs mt-xs text-secondary font-data-tabular text-data-tabular">
            <span className="material-symbols-outlined text-[16px]">update</span>
            Last Calculated: Today, 09:41 AM EST
          </div>
        </div>
        <div className="flex gap-sm">
          <button className="px-md py-sm bg-surface-pearl border border-hairline text-ink rounded-full font-body-strong text-[14px] hover:bg-surface-container-low transition-colors">
            Export CSV
          </button>
          <button className="px-md py-sm bg-primary text-canvas-white rounded-full font-body-strong text-[14px] hover:bg-surface-tint transition-all flex items-center gap-xs shadow-sm">
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            Generate Procurement Report
          </button>
        </div>
      </div>

      {/* Stale Data Warning Banner */}
      <div className="mb-lg bg-surface-bright border border-warning-amber/30 rounded-lg p-sm flex items-start gap-sm shadow-sm">
        <span className="material-symbols-outlined text-warning-amber mt-[2px] text-[20px]">warning</span>
        <div>
          <h4 className="font-body-strong text-[14px] text-ink">Stale Data Warning</h4>
          <p className="font-body text-secondary text-[13px] mt-0.5">
            Scraper health for 2 vendors (Salesforce, Zendesk) is currently degraded. Projections may rely on historical data older than 48 hours.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-xl flex-grow">

        {/* Left Column: Metrics & Charts */}
        <div className="col-span-1 lg:col-span-8 space-y-gutter">

          {/* KPI Cards (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-sm">

            {/* Current Spend */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
              <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Current Annual Spend</div>
              <div className="font-display-md text-[28px] font-bold text-ink">{formatCurrency(currentAnnualSpend)}</div>
            </div>

            {/* Projected Spend */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md relative overflow-hidden shadow-sm">
              <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Projected Annual Spend</div>
              <div className="font-display-md text-[28px] font-bold text-ink">{formatCurrency(projectedSpend)}</div>
              <div className="absolute top-3 right-3 flex items-center gap-0.5 text-critical-red font-data-tabular text-[11px] bg-error-container/50 px-1.5 py-0.5 rounded-sm">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +{((totalDelta / currentAnnualSpend) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Total Delta */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
              <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Total Delta</div>
              <div className={`font-display-md text-[28px] font-bold ${totalDelta >= 0 ? "text-critical-red" : "text-success-green"}`}>
                {totalDelta >= 0 ? "+" : ""}{formatCurrency(totalDelta)}
              </div>
            </div>

            {/* Renewal Exposure */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
              <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Renewal Exp. (90d)</div>
              <div className="font-display-md text-[28px] font-bold text-ink">{formatCurrency(renewalExposure)}</div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">

            {/* Cost Variance Trend (SVG Bar Chart) */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md h-64 flex flex-col shadow-sm">
              <div className="font-body-strong text-[15px] text-ink mb-md">Cost Variance Trend</div>
              <div className="flex-grow flex items-end justify-between px-4 pb-2 bg-canvas-parchment rounded border border-hairline relative">
                <div className="absolute top-2 left-2 text-[10px] text-secondary font-data-tabular">Monthly Variance ($k)</div>
                <div className="w-full flex justify-between items-end h-[80%] px-2">
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-primary/40 h-8 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">Mar</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-primary/40 h-10 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">Apr</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-primary/40 h-7 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">May</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-primary/40 h-12 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">Jun</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-warning-amber/60 h-20 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">Jul</span>
                  </div>
                  <div className="flex flex-col items-center w-1/6">
                    <div className="w-6 bg-critical-red/80 h-28 rounded-t"></div>
                    <span className="text-[10px] text-secondary mt-1">Aug</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spend by Category (SVG Donut Chart) */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md h-64 flex flex-col shadow-sm">
              <div className="font-body-strong text-[15px] text-ink mb-md">Spend by Category</div>
              <div className="flex-grow flex items-center justify-center bg-canvas-parchment rounded border border-hairline relative">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Donut sectors */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e0e0e0" strokeWidth="3" />
                  {/* Category 1: Infra - 40% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#004e9f" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="100" />
                  {/* Category 2: CRM - 30% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff9f0a" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="60" />
                  {/* Category 3: DevTools - 20% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#28a745" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="30" />
                  {/* Category 4: AI - 10% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff3b30" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="10" />
                  <circle cx="18" cy="18" r="12" fill="#fafafc" />
                </svg>
                <div className="absolute right-4 top-4 flex flex-col gap-1 text-[10px] font-medium text-secondary">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#004e9f]"></span> Infra (40%)</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff9f0a]"></span> CRM (30%)</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#28a745]"></span> DevTools (20%)</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30]"></span> AI (10%)</div>
                </div>
              </div>
            </div>

          </div>

          {/* Main Table: Vendor Impact Scoring */}
          <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
            <div className="p-md border-b border-hairline bg-surface-pearl flex justify-between items-center">
              <h3 className="font-body-strong text-body-strong text-ink font-semibold">Vendor Impact Scoring</h3>
              <div className="flex gap-xs">
                <button className="p-xs text-secondary hover:text-ink transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                <button className="p-xs text-secondary hover:text-ink transition-colors">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-canvas-parchment border-b border-hairline">
                    <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Vendor</th>
                    <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Impact Score</th>
                    <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Core Drivers</th>
                    <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase text-right">Annual Delta</th>
                    <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-[13px] text-ink divide-y divide-hairline">
                  {mockFinancialImpactScores.map((scoreItem) => (
                    <tr key={scoreItem.vendor} className="hover:bg-surface-bright transition-colors cursor-pointer">
                      <td className="py-3 px-md flex items-center gap-sm">
                        <div className={`w-2.5 h-2.5 rounded-full ${scoreItem.impactColor === "red" ? "bg-critical-red" :
                            scoreItem.impactColor === "amber" ? "bg-warning-amber" : "bg-success-green"
                          }`}></div>
                        <span className="font-semibold">{scoreItem.vendor}</span>
                      </td>
                      <td className="py-3 px-md">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${scoreItem.impactColor === "red" ? "bg-critical-red" :
                                scoreItem.impactColor === "amber" ? "bg-warning-amber" : "bg-success-green"
                              }`} style={{ width: `${scoreItem.score}%` }}></div>
                          </div>
                          <span>{scoreItem.score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-md text-secondary">{scoreItem.coreDrivers}</td>
                      <td className={`py-3 px-md text-right font-medium ${scoreItem.impactColor === "red" ? "text-critical-red" :
                          scoreItem.impactColor === "amber" ? "text-warning-amber" : "text-success-green"
                        }`}>{scoreItem.annualDelta}</td>
                      <td className="py-3 px-md">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-medium border border-primary-container/20">
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
          <div className="bg-canvas-white border border-hairline rounded-lg p-md sticky top-20 shadow-sm">
            <div className="flex justify-between items-center mb-md pb-xs border-b border-hairline">
              <h3 className="font-body-strong text-body-strong text-ink flex items-center gap-sm font-semibold">
                <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
                Profile Overrides
              </h3>
              <button
                onClick={handleReset}
                className="text-primary text-[13px] hover:underline font-body-strong"
              >
                Reset
              </button>
            </div>
            <p className="font-body text-secondary text-[13px] mb-lg leading-relaxed">
              Refine calculations by overriding Sentinel's detected company metrics.
            </p>

            <div className="space-y-md">
              {/* Seat Count */}
              <div>
                <label className="block font-label-capsule text-[12px] text-ink mb-1.5 font-medium">Total Seat Count</label>
                <div className="flex relative">
                  <input
                    className="w-full bg-surface-bright border border-hairline rounded-md py-1.5 px-sm font-data-tabular text-[13px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary pr-12 text-ink"
                    type="number"
                    value={seatCount}
                    onChange={(e) => setSeatCount(parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider text-primary font-bold">User</span>
                </div>
              </div>

              {/* Monthly Spend */}
              <div>
                <label className="block font-label-capsule text-[12px] text-ink mb-1.5 font-medium">Avg. Monthly Cloud Spend</label>
                <div className="flex relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[13px]">$</span>
                  <input
                    className="w-full bg-surface-container-low border border-hairline border-dashed rounded-sm py-1.5 pl-7 pr-20 font-data-tabular text-[13px] text-secondary focus:outline-none"
                    type="text"
                    disabled={true}
                    value={appliedMonthlySpend.toLocaleString()}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-secondary font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Sentinel
                  </span>
                </div>
              </div>

              {/* Next Major Renewal */}
              <div>
                <label className="block font-label-capsule text-[12px] text-ink mb-1.5 font-medium">Global Renewal Anchor Date</label>
                <input
                  className="w-full bg-surface-bright border border-hairline rounded-md py-1.5 px-sm font-data-tabular text-[13px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-ink"
                  type="date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-lg pt-md border-t border-hairline">
              <button
                onClick={handleApply}
                className="w-full bg-surface-pearl border border-hairline text-ink hover:bg-surface-container rounded-full font-body-strong text-[13px] py-2 transition-all shadow-sm active:scale-98"
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
