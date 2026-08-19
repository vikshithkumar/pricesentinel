import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { changeDetails } from "../mockData";

export const ChangeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const data = id ? changeDetails[id] : null;

  if (!data) {
    return (
      <main className="flex-1 p-margin-desktop bg-background flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[48px] text-secondary mb-2">
          error
        </span>
        <h3 className="font-tagline text-tagline text-ink font-semibold">
          Change Event Not Found
        </h3>
        <p className="font-body text-body text-secondary mt-1">
          The requested intelligence report could not be located.
        </p>
        <Link
          to="/intelligence"
          className="mt-4 bg-primary text-on-primary py-2 px-6 rounded-full hover:bg-surface-tint transition-all font-body-strong"
        >
          Return to Feed
        </Link>
      </main>
    );
  }

  // Determine severity indicator color
  const isNegative = data.monthlyDelta.startsWith("-");
  const isPositive = data.monthlyDelta.startsWith("+");
  const impactColorClass = isNegative
    ? "text-critical-red"
    : isPositive
    ? "text-success-green"
    : "text-secondary";

  const severityPipColor = isNegative
    ? "bg-critical-red"
    : isPositive
    ? "bg-success-green"
    : "bg-warning-amber";

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Contextual Sub-Header (Page Specific) */}
      <header className="bg-canvas-white/80 backdrop-blur-xl border-b border-hairline sticky top-0 z-40 px-margin-desktop py-md flex justify-between items-center transition-all h-16 shrink-0">
        <Link
          to="/intelligence"
          className="flex items-center gap-xs text-secondary hover:text-primary transition-colors font-body text-[15px]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to Intelligence Feed</span>
        </Link>
        <button className="bg-surface-pearl border border-hairline rounded-full px-lg py-1 text-ink hover:bg-surface-container-low transition-colors font-body-strong text-[14px] flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">group_add</span>
          <span>Alert Team</span>
        </button>
      </header>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto px-margin-mobile md:px-margin-desktop py-xl max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-xs mb-md font-body text-sm" aria-label="Breadcrumb">
          <Link to="/" className="text-secondary hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-secondary text-[16px]">chevron_right</span>
          <Link to="/intelligence" className="text-secondary hover:text-primary transition-colors">
            Intelligence Feed
          </Link>
          <span className="material-symbols-outlined text-secondary text-[16px]">chevron_right</span>
          <span className="text-ink font-medium">{data.title}</span>
        </nav>

        {/* Page Title Section */}
        <div className="mb-lg">
          <div className="flex items-center gap-sm mb-sm">
            <span className={`w-2 h-2 rounded-full ${severityPipColor}`}></span>
            <span className="font-data-tabular text-data-tabular text-secondary uppercase tracking-wider text-[11px] font-semibold">
              {data.timeText}
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-[34px] md:leading-tight font-bold text-ink mb-xs">
            {data.title}
          </h1>
          <p className="font-lead text-[19px] leading-relaxed text-secondary max-w-3xl">
            {data.subtitle}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Main Column (2/3) */}
          <div className="md:col-span-8 flex flex-col gap-lg">
            {/* Context Section */}
            <section className="bg-canvas-white border border-hairline rounded-lg p-lg shadow-sm">
              <div className="flex items-center gap-xs mb-md">
                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <h2 className="font-body-strong text-[16px] text-ink font-semibold">
                  The Context
                </h2>
              </div>
              <p className="font-body text-body text-on-surface-variant mb-md leading-relaxed">
                {data.contextText}
              </p>
              <h3 className="font-body-strong text-[12px] text-ink mb-sm uppercase tracking-wider font-semibold">
                Key drivers analyzed
              </h3>
              <ul className="flex flex-col gap-sm">
                {data.keyDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-secondary text-[18px] mt-[2px]">
                      {idx === 0 ? "trending_down" : "account_balance_wallet"}
                    </span>
                    <span className="font-body text-[14px] text-on-surface-variant leading-relaxed">
                      {driver}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Plan Structure Diff Table */}
            <section className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
              <div className="p-md border-b border-hairline bg-canvas-parchment">
                <h2 className="font-body-strong text-[16px] text-ink font-semibold">
                  Plan Structure Diff
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-pearl border-b border-hairline">
                      <th className="py-2.5 px-4 font-data-tabular text-[12px] text-secondary font-medium w-1/3">
                        Metric / Feature
                      </th>
                      <th className="py-2.5 px-4 font-data-tabular text-[12px] text-secondary font-medium w-1/3">
                        Previous State
                      </th>
                      <th className="py-2.5 px-4 font-data-tabular text-[12px] text-secondary font-medium w-1/3">
                        New State (Current)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-[13px] text-ink divide-y divide-hairline">
                    {data.metrics.map((metric, idx) => {
                      const isMetricCritical = metric.status === "critical";
                      const isMetricSuccess = metric.status === "success";

                      const statusBg = isMetricCritical
                        ? "bg-critical-red/5 text-critical-red font-semibold"
                        : isMetricSuccess
                        ? "bg-success-green/5 text-success-green font-semibold"
                        : "";

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">{metric.name}</td>
                          <td className="py-3 px-4 text-secondary">{metric.previous}</td>
                          <td className={`py-3 px-4 ${statusBg}`}>
                            {metric.current}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="md:col-span-4 flex flex-col gap-lg">
            {/* Estimated Impact Card */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-lg relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-critical-red/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="font-body-strong text-[16px] text-ink font-semibold mb-md relative z-10">
                Estimated Impact
              </h3>
              <div className="mb-lg relative z-10">
                <div className="text-secondary font-data-tabular text-[11px] uppercase tracking-wider mb-xs font-semibold">
                  Projected Monthly Delta
                </div>
                <div className={`font-display-md text-[32px] font-bold flex items-baseline gap-xs ${impactColorClass}`}>
                  {data.monthlyDelta === "$0" ? "N/A" : data.monthlyDelta}
                  {data.monthlyDelta !== "$0" && data.monthlyDelta !== "Unknown" && (
                    <span className="text-sm font-body font-normal text-secondary">/mo</span>
                  )}
                </div>
              </div>
              <div className="space-y-sm mb-lg relative z-10 text-[14px]">
                <div className="flex justify-between items-center border-b border-hairline pb-xs">
                  <span className="font-body text-secondary">Current Spend Avg</span>
                  <span className="font-data-tabular text-ink font-medium">{data.spendAvg}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-secondary">New Run Rate</span>
                  <span className="font-data-tabular text-ink font-semibold">{data.runRate}</span>
                </div>
              </div>
              <button className="w-full bg-primary text-on-primary font-body-strong py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm relative z-10 text-[14px] font-semibold active:scale-[0.98]">
                Update Budget Forecast
              </button>
            </div>

            {/* System Status Box */}
            <div className="bg-canvas-parchment border border-hairline rounded-lg p-md flex items-start gap-sm shadow-sm">
              <span className="material-symbols-outlined text-success-green mt-0.5">
                check_circle
              </span>
              <div>
                <div className="font-body-strong text-[14px] text-ink font-semibold">
                  System Status
                </div>
                <div className="font-data-tabular text-[12px] text-secondary mt-1">
                  Scraper Validation:{" "}
                  <Link to="/scrapers" className="text-primary hover:underline font-semibold">
                    High Confidence ({data.confidenceScore})
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
              <div className="p-md border-b border-hairline bg-surface-pearl">
                <h3 className="font-body-strong text-[15px] text-ink font-semibold">
                  Quick Actions
                </h3>
              </div>
              <div className="flex flex-col text-[14px]">
                <button className="flex items-center gap-sm px-md py-3 border-b border-hairline hover:bg-surface-container-low transition-colors text-left group">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">
                    group
                  </span>
                  <span className="font-body text-ink group-hover:text-primary transition-colors font-medium">
                    Alert Team
                  </span>
                </button>
                <button className="flex items-center gap-sm px-md py-3 border-b border-hairline hover:bg-surface-container-low transition-colors text-left group">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">
                    snooze
                  </span>
                  <span className="font-body text-ink group-hover:text-primary transition-colors font-medium">
                    Snooze Alert
                  </span>
                </button>
                <button
                  onClick={() => navigate("/vendors")}
                  className="flex items-center gap-sm px-md py-3 hover:bg-surface-container-low transition-colors text-left group"
                >
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">
                    visibility
                  </span>
                  <span className="font-body text-ink group-hover:text-primary transition-colors font-medium">
                    Watch Vendor
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
