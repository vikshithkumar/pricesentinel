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
            Last Calculated: Live API (Spring Boot connected)
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            disabled={downloadingCsv}
            className="px-4 py-2 bg-[#fcfcfc] border border-[#e2e8f0] text-[#020520] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 disabled:opacity-50"
          >
            {downloadingCsv ? "Exporting CSV..." : "Export CSV"}
          </button>
          <button
            onClick={handleExportCsv}
            disabled={downloadingCsv}
            className="px-5 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5 shadow-sm disabled:opacity-50"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Current Annual Spend</div>
              <div className="font-mono text-[28px] font-semibold text-[#020520]">{formatCurrency(currentAnnualSpend)}</div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Projected Annual Spend</div>
              <div className="font-mono text-[28px] font-semibold text-[#f26052]">{formatCurrency(projectedSpend)}</div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Net Change (Variance)</div>
              <div className="font-mono text-[28px] font-semibold text-[#f26052]">+{formatCurrency(totalDelta)}</div>
            </div>

            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">At-Risk Renewal Exposure</div>
              <div className="font-mono text-[28px] font-semibold text-[#ffa64d]">{formatCurrency(renewalExposure)}</div>
            </div>
          </div>

          {/* Impact Score Table */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <h3 className="font-inter text-[18px] text-[#020520] font-semibold mb-4">Vendor Financial Impact Scores</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[13px]">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-[12px] text-[#6b7280] uppercase tracking-wider font-inter">
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Impact Score</th>
                    <th className="py-2.5 px-3">Core Drivers</th>
                    <th className="py-2.5 px-3 text-right">Annual Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {(financialData?.vendorImpactScores || mockFinancialImpactScores).map((v: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f0f4fe]/50 transition-colors">
                      <td className="py-3 px-3 font-inter font-semibold text-[#020520]">{v.vendorName}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          v.impactScore >= 80 ? "bg-[#f26052]/10 text-[#f26052]" : "bg-[#ffa64d]/10 text-[#ffa64d]"
                        }`}>
                          {v.impactScore} / 100
                        </span>
                      </td>
                      <td className="py-3 px-3 font-inter text-[#374151] text-[12px]">
                        {Array.isArray(v.coreDrivers) ? v.coreDrivers.join(", ") : v.coreDrivers}
                      </td>
                      <td className={`py-3 px-3 text-right font-semibold ${
                        (typeof v.annualDelta === 'number' ? v.annualDelta : 0) > 0 ? "text-[#f26052]" : "text-[#16ca2e]"
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
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <h3 className="font-inter text-[18px] text-[#020520] font-semibold mb-2">Impact Scenario Simulator</h3>
            <p className="font-inter text-[#6b7280] text-[13px] mb-4">Adjust seat allocations and monthly spend to simulate financial risk.</p>

            <div className="space-y-4 font-inter">
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1">Active Seats ({seatCount})</label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="w-full accent-[#145aff]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1">Current Monthly Spend ($)</label>
                <input
                  type="number"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-[10px] text-[13px] font-mono text-[#020520]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2 bg-[#145aff] text-white rounded-full font-medium text-[13px] hover:bg-[#145aff]/90 transition-colors"
                >
                  Apply Simulation
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#f1f5f9] text-[#374151] rounded-full font-medium text-[13px] hover:bg-[#e2e8f0] transition-colors"
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
