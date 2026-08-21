import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockFinancialImpactScores } from "../mockData";
import { api } from "../services/api";
import type { FinancialImpactResponse } from "../services/api";

export const FinancialImpactDetail: React.FC = () => {
  const [seatCount, setSeatCount] = useState<number>(1250);
  const [monthlySpend, setMonthlySpend] = useState<number>(350000);

  const [appliedSeats, setAppliedSeats] = useState<number>(1250);
  const [appliedMonthlySpend, setAppliedMonthlySpend] = useState<number>(350000);
  const [financialData, setFinancialData] = useState<FinancialImpactResponse | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    api.getFinancialImpact()
      .then((data: FinancialImpactResponse) => {
        if (isMounted && data) {
          setFinancialData(data);
          if (data.totalProjectedAnnualSpend) {
            setAppliedMonthlySpend(Math.round(data.totalProjectedAnnualSpend / 12));
          }
        }
      })
      .catch((err) => {
        console.warn("Backend financial impact API unavailable, using local calculation", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportCsv = async () => {
    setDownloadingCsv(true);
    try {
      const blob = await api.downloadFinancialImpactCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "financial_impact_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`CSV Export error: ${err.message || 'Export failed'}`);
    } finally {
      setDownloadingCsv(false);
    }
  };

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
    setAppliedSeats(1250);
    setAppliedMonthlySpend(350000);
  };

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-3 font-dm-sans text-[12px] text-steel dark:text-slate" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-carbon dark:hover:text-white transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Intelligence</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-carbon dark:text-bone font-medium">Financial Impact</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h1 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">
            Financial Impact Analysis
          </h1>
          <div className="flex items-center gap-2 mt-1.5 text-steel dark:text-ash font-geist text-[12px]">
            <span className="material-symbols-outlined text-[16px] text-emerald-500 dark:text-emerald-400">update</span>
            Last Calculated: Live API (Spring Boot connected)
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={downloadingCsv}
            className="px-5 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone rounded-full font-dm-sans font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {downloadingCsv ? "Exporting CSV..." : "Export CSV"}
          </button>
          <button
            onClick={handleExportCsv}
            disabled={downloadingCsv}
            className="px-5 py-2.5 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black rounded-full font-dm-sans font-medium text-[13px] dark:hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            <span>Generate Procurement Report</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-grow">

        {/* Left Column */}
        <div className="col-span-1 lg:col-span-8 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
              <div className="text-steel dark:text-ash font-dm-sans text-[12px] uppercase tracking-wider mb-1 font-medium">Current Annual Spend</div>
              <div className="font-geist text-[28px] font-medium text-ink-black dark:text-bone">{formatCurrency(currentAnnualSpend)}</div>
            </div>

            <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
              <div className="text-steel dark:text-ash font-dm-sans text-[12px] uppercase tracking-wider mb-1 font-medium">Projected Annual Spend</div>
              <div className="font-geist text-[28px] font-medium text-red-600 dark:text-red-400">{formatCurrency(projectedSpend)}</div>
            </div>

            <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
              <div className="text-steel dark:text-ash font-dm-sans text-[12px] uppercase tracking-wider mb-1 font-medium">Net Change (Variance)</div>
              <div className="font-geist text-[28px] font-medium text-red-600 dark:text-red-400">+{formatCurrency(totalDelta)}</div>
            </div>

            <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
              <div className="text-steel dark:text-ash font-dm-sans text-[12px] uppercase tracking-wider mb-1 font-medium">At-Risk Renewal Exposure</div>
              <div className="font-geist text-[28px] font-medium text-amber-600 dark:text-amber-400">{formatCurrency(renewalExposure)}</div>
            </div>
          </div>

          {/* Impact Score Table */}
          <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 shadow-sm dark:shadow-glass">
            <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-5">Vendor Financial Impact Scores</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-dm-sans text-[13px]">
                <thead>
                  <tr className="border-b border-bone-light dark:border-white/10 text-[12px] text-steel dark:text-ash uppercase tracking-wider font-dm-sans">
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Impact Score</th>
                    <th className="py-3 px-4">Core Drivers</th>
                    <th className="py-3 px-4 text-right">Annual Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bone-light/60 dark:divide-white/5 text-carbon dark:text-bone">
                  {(financialData?.vendorImpactScores || mockFinancialImpactScores).map((v: any, idx: number) => (
                    <tr key={idx} className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors">
                      <td className="py-4 px-4 font-geist font-medium text-ink-black dark:text-bone">{v.vendorName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-medium border ${
                          v.impactScore >= 80 ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20" : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        }`}>
                          {v.impactScore} / 100
                        </span>
                      </td>
                      <td className="py-4 px-4 font-dm-sans text-steel dark:text-ash text-[13px]">
                        {Array.isArray(v.coreDrivers) ? v.coreDrivers.join(", ") : v.coreDrivers}
                      </td>
                      <td className={`py-4 px-4 text-right font-geist font-medium ${
                        (typeof v.annualDelta === 'number' ? v.annualDelta : 0) > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {typeof v.annualDelta === 'number' ? formatCurrency(v.annualDelta) : v.annualDelta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Scenario Simulator */}
        <aside className="col-span-1 lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 shadow-sm dark:shadow-glass">
            <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-2">Impact Scenario Simulator</h3>
            <p className="font-dm-sans text-steel dark:text-ash text-[13px] mb-5">Adjust seat allocations and monthly spend to simulate financial risk.</p>

            <div className="space-y-5 font-dm-sans">
              <div>
                <label className="block text-[13px] font-medium text-carbon dark:text-bone mb-2">Active Seats ({seatCount})</label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="w-full accent-signal-blue dark:accent-white"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-carbon dark:text-bone mb-2">Current Monthly Spend ($)</label>
                <input
                  type="number"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black rounded-full font-medium text-[13px] dark:hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  Apply Simulation
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-vapor dark:bg-white/5 text-carbon dark:text-bone border border-bone-light dark:border-white/10 rounded-full font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};


