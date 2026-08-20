import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockReports } from "../mockData";

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Filters reports by Category
  const filteredReports = mockReports.filter((report) => {
    if (activeCategory === "All") return true;
    return report.category === activeCategory;
  });

  return (
    <main className="flex-grow overflow-y-auto bg-background flex flex-col md:flex-row h-full">
      {/* Reports Sidebar (Sub-navigation) */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-hairline bg-canvas-white py-lg px-margin-mobile md:px-lg flex-shrink-0">
        <div className="mb-xl">
          <h3 className="font-body-strong text-ink mb-sm uppercase tracking-wider text-[11px] font-bold">Categories</h3>
          <ul className="space-y-xs">
            {["All", "Executive", "Technical", "Financial"].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-sm py-1.5 rounded text-[13px] transition-colors ${activeCategory === cat
                      ? "bg-surface-container-low text-primary font-body-strong font-semibold"
                      : "hover:bg-canvas-parchment text-secondary font-body"
                    }`}
                >
                  {cat === "All" ? "All Reports" : `${cat} Summaries`}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-body-strong text-ink mb-sm uppercase tracking-wider text-[11px] font-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            Saved Schedules
          </h3>
          <ul className="space-y-xs">
            <li>
              <div className="px-sm py-2 rounded border border-hairline bg-surface-pearl flex justify-between items-center group cursor-pointer hover:border-outline-variant transition-colors">
                <div>
                  <p className="font-data-tabular text-[13px] text-ink font-medium">Weekly C-Suite</p>
                  <p className="font-nav-link text-[11px] text-secondary">Mondays, 8:00 AM</p>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
            <li>
              <div className="px-sm py-2 rounded border border-hairline bg-surface-pearl flex justify-between items-center group cursor-pointer hover:border-outline-variant transition-colors">
                <div>
                  <p className="font-data-tabular text-[13px] text-ink font-medium">EOM Procurement</p>
                  <p className="font-nav-link text-[11px] text-secondary">Last Day, 5:00 PM</p>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Reports Grid Area */}
      <section className="flex-grow p-margin-mobile md:p-margin-desktop bg-canvas-parchment/30">
        <nav aria-label="Breadcrumb" className="flex items-center gap-xxs mb-md text-[12px] text-secondary font-medium">
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
          <span className="material-symbols-outlined text-secondary text-[14px] select-none">chevron_right</span>
          <span className="text-ink">Reports</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-sm border-b border-hairline pb-md">
          <div>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-ink font-bold tracking-tight">Reports</h2>
            <p className="font-body text-[14px] text-secondary mt-1">Executive-ready pricing intelligence summaries.</p>
          </div>
          <button
            onClick={() => navigate("/reports/configure")}
            className="bg-primary text-on-primary font-body-strong text-[13px] px-lg py-2 rounded-full flex items-center gap-xs hover:scale-95 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Generate New Report
          </button>
        </div>

        {/* Bento Grid / Cards */}
        {filteredReports.length === 0 ? (
          <div className="border border-hairline border-dashed rounded-lg p-section text-center bg-canvas-white shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 mb-md bg-surface-container-low rounded-full flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">assessment</span>
            </div>
            <h3 className="font-tagline text-[18px] text-ink font-semibold">No reports found</h3>
            <p className="font-body text-secondary text-[14px] mt-xs max-w-sm">
              Try selecting a different report category or configure a new automated report.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
            {filteredReports.map((report) => {
              const isComplete = report.status === "Complete";
              const isScheduled = report.status === "Scheduled";
              const isWarning = report.status === "Review Needed";

              return (
                <div
                  key={report.id}
                  className="bg-canvas-white border border-hairline rounded-lg p-lg flex flex-col justify-between hover:border-outline-variant transition-colors cursor-pointer relative shadow-sm"
                >
                  {report.category === "Executive" && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-20 rounded-t-lg"></div>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-sm">
                      <span className="px-xs py-xxs bg-surface-container-low text-secondary font-nav-link text-[11px] font-semibold tracking-wider rounded border border-hairline uppercase">
                        {report.category}
                      </span>
                      <span className={`flex items-center gap-xxs font-nav-link text-[12px] ${isComplete ? "text-success-green" : isWarning ? "text-warning-amber font-semibold animate-pulse" : "text-secondary"
                        }`}>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isComplete ? "check_circle" : isWarning ? "warning" : "event"}
                        </span>
                        {report.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                      className={`font-lead text-[18px] text-ink tracking-tight mb-xs font-semibold hover:text-primary transition-colors`}
                    >
                      {report.title}
                    </h3>
                    <p className="font-data-tabular text-[13px] text-secondary mb-md">{report.dateRange}</p>

                    <div className="grid grid-cols-2 gap-sm mb-lg border-t border-hairline pt-sm">
                      {isComplete && (
                        <>
                          <div>
                            <p className="font-nav-link text-[10px] text-secondary uppercase tracking-wider mb-xxs">Changes</p>
                            <p className="font-display-md text-[20px] font-bold text-ink">{report.changesCount}</p>
                          </div>
                          <div>
                            <p className="font-nav-link text-[10px] text-secondary uppercase tracking-wider mb-xxs">Impact</p>
                            <p className="font-display-md text-[20px] font-bold text-primary">{report.impactText}</p>
                          </div>
                        </>
                      )}

                      {isScheduled && (
                        <div className="col-span-2">
                          <p className="font-nav-link text-[10px] text-secondary uppercase tracking-wider mb-xxs">Status</p>
                          <p className="font-body text-[14px] text-ink">Scheduled run active</p>
                        </div>
                      )}

                      {isWarning && (
                        <>
                          <div>
                            <p className="font-nav-link text-[10px] text-secondary uppercase tracking-wider mb-xxs">Uptime</p>
                            <p className="font-display-md text-[20px] font-bold text-ink">{report.uptimeText}</p>
                          </div>
                          <div>
                            <p className="font-nav-link text-[10px] text-secondary uppercase tracking-wider mb-xxs">Failures</p>
                            <p className="font-display-md text-[20px] font-bold text-critical-red">{report.failuresCount}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-hairline pt-sm mt-auto">
                    <p className="font-nav-link text-[11px] text-secondary">
                      {isScheduled ? `Runs: ${report.runsTimeText}` : `Generated: ${report.generatedTimeText}`}
                    </p>
                    <div className="flex gap-xs">
                      <button
                        aria-label="Schedule"
                        onClick={(e) => { e.stopPropagation(); console.log("Schedule clicked"); }}
                        className={`p-1.5 text-secondary hover:text-primary transition-colors border ${isScheduled ? "border-hairline bg-surface-pearl text-primary" : "border-transparent"} rounded`}
                      >
                        <span className="material-symbols-outlined text-[16px] block">schedule</span>
                      </button>
                      {isComplete && (
                        <button
                          aria-label="Export"
                          onClick={(e) => { e.stopPropagation(); console.log("Mock export clicked"); }}
                          className="p-1.5 text-secondary hover:text-primary transition-colors border border-transparent rounded"
                        >
                          <span className="material-symbols-outlined text-[16px] block">download</span>
                        </button>
                      )}
                      <button
                        onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                        className={`px-3 py-1 bg-surface-container-low hover:bg-surface-container-high text-primary font-body-strong text-[12px] rounded transition-colors ${!isComplete ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={!isComplete}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
