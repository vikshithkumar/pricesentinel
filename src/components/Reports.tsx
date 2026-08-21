import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockReports } from "../mockData";

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredReports = mockReports.filter((report) => {
    if (activeCategory === "All") return true;
    return report.category === activeCategory;
  });

  return (
    <main className="flex-grow overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col md:flex-row h-full w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Reports Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-bone-light dark:border-white/10 bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md py-6 px-4 md:px-6 flex-shrink-0 font-dm-sans">
        <div className="mb-6">
          <h3 className="text-steel dark:text-ash mb-3 uppercase tracking-wider text-[11px] font-geist font-medium">Categories</h3>
          <ul className="space-y-1.5">
            {["All", "Executive", "Technical", "Financial"].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-full text-[13px] transition-all duration-150 ${activeCategory === cat
                      ? "bg-signal-blue/15 text-signal-blue border border-signal-blue/30 dark:bg-white/15 dark:text-white font-medium shadow-sm dark:border-white/20"
                      : "hover:bg-vapor dark:hover:bg-white/5 text-steel dark:text-ash hover:text-carbon dark:hover:text-white"
                    }`}
                >
                  {cat === "All" ? "All Reports" : `${cat} Summaries`}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-steel dark:text-ash mb-3 uppercase tracking-wider text-[11px] font-geist font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate">schedule</span>
            Saved Schedules
          </h3>
          <ul className="space-y-2.5">
            <li>
              <div className="px-4 py-3 rounded-[16px] border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 flex justify-between items-center group cursor-pointer hover:border-signal-blue/30 dark:hover:border-white/20 transition-all">
                <div>
                  <p className="font-geist text-[13px] text-ink-black dark:text-bone font-medium">Weekly C-Suite</p>
                  <p className="font-geist text-[11px] text-steel dark:text-slate">Mondays, 8:00 AM</p>
                </div>
                <span className="material-symbols-outlined text-steel dark:text-slate group-hover:text-carbon dark:group-hover:text-white transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
            <li>
              <div className="px-4 py-3 rounded-[16px] border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 flex justify-between items-center group cursor-pointer hover:border-signal-blue/30 dark:hover:border-white/20 transition-all">
                <div>
                  <p className="font-geist text-[13px] text-ink-black dark:text-bone font-medium">EOM Procurement</p>
                  <p className="font-geist text-[11px] text-steel dark:text-slate">Last Day, 5:00 PM</p>
                </div>
                <span className="material-symbols-outlined text-steel dark:text-slate group-hover:text-carbon dark:group-hover:text-white transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Reports Grid Area */}
      <section className="flex-grow p-4 md:p-6 bg-frost dark:bg-[#0a0a0a]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3 text-[12px] text-steel dark:text-slate font-dm-sans">
          <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-carbon dark:text-bone font-medium">Reports</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-bone-light dark:border-white/10 pb-6">
          <div>
            <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">Reports</h2>
            <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-1">Executive-ready pricing intelligence summaries.</p>
          </div>
          <button
            onClick={() => navigate("/reports/configure")}
            className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[13px] px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Generate New Report
          </button>
        </div>

        {/* Bento Grid */}
        {filteredReports.length === 0 ? (
          <div className="border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 text-center bg-vapor/30 dark:bg-white/[0.01] shadow-sm dark:shadow-glass flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-vapor dark:bg-white/5 rounded-full flex items-center justify-center text-steel dark:text-slate border border-bone-light dark:border-white/10">
              <span className="material-symbols-outlined text-[36px]">assessment</span>
            </div>
            <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">No reports found</h3>
            <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1 max-w-sm">
              Try selecting a different report category or configure a new automated report.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const isComplete = report.status === "Complete";
              const isScheduled = report.status === "Scheduled";
              const isWarning = report.status === "Review Needed";

              return (
                <div
                  key={report.id}
                  className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 flex flex-col justify-between hover:border-signal-blue/30 dark:hover:border-white/25 transition-all duration-200 cursor-pointer relative shadow-sm dark:shadow-glass"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 font-dm-sans">
                      <span className="px-3 py-1 bg-vapor dark:bg-white/5 text-carbon dark:text-bone text-[11px] font-medium rounded-full border border-bone-light dark:border-white/10 uppercase">
                        {report.category}
                      </span>
                      <span className={`flex items-center gap-1.5 text-[12px] font-medium ${isComplete ? "text-emerald-600 dark:text-emerald-400" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-steel dark:text-ash"
                        }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {isComplete ? "check_circle" : isWarning ? "warning" : "event"}
                        </span>
                        {report.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                      className="font-geist text-[18px] text-ink-black dark:text-bone tracking-tight mb-1 font-medium hover:text-signal-blue dark:hover:text-white transition-colors"
                    >
                      {report.title}
                    </h3>
                    <p className="font-geist text-[13px] text-steel dark:text-slate mb-5">{report.dateRange}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6 border-t border-bone-light dark:border-white/10 pt-4 font-geist">
                      {isComplete && (
                        <>
                          <div>
                            <p className="text-[10px] text-steel dark:text-slate uppercase tracking-wider mb-1">Changes</p>
                            <p className="text-[20px] font-medium text-ink-black dark:text-bone">{report.changesCount}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-steel dark:text-slate uppercase tracking-wider mb-1">Impact</p>
                            <p className="text-[20px] font-medium text-ink-black dark:text-bone">{report.impactText}</p>
                          </div>
                        </>
                      )}

                      {isScheduled && (
                        <div className="col-span-2 font-dm-sans">
                          <p className="text-[10px] text-steel dark:text-slate font-geist uppercase tracking-wider mb-1">Status</p>
                          <p className="text-[14px] text-carbon dark:text-bone">Scheduled run active</p>
                        </div>
                      )}

                      {isWarning && (
                        <>
                          <div>
                            <p className="text-[10px] text-steel dark:text-slate uppercase tracking-wider mb-1">Uptime</p>
                            <p className="text-[20px] font-medium text-ink-black dark:text-bone">{report.uptimeText}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-steel dark:text-slate uppercase tracking-wider mb-1">Failures</p>
                            <p className="text-[20px] font-medium text-red-600 dark:text-red-400">{report.failuresCount}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-bone-light dark:border-white/10 pt-4 mt-auto font-dm-sans">
                    <p className="font-geist text-[11px] text-steel dark:text-slate">
                      {isScheduled ? `Runs: ${report.runsTimeText}` : `Generated: ${report.generatedTimeText}`}
                    </p>
                    <div className="flex gap-2">
                      <button
                        aria-label="Schedule"
                        onClick={(e) => { e.stopPropagation(); console.log("Schedule clicked"); }}
                        className={`p-1.5 text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors border ${isScheduled ? "border-signal-blue/30 dark:border-white/20 bg-signal-blue/10 dark:bg-white/10 text-signal-blue dark:text-white" : "border-transparent"} rounded-full`}
                      >
                        <span className="material-symbols-outlined text-[16px] block">schedule</span>
                      </button>
                      {isComplete && (
                        <button
                          aria-label="Export"
                          onClick={(e) => { e.stopPropagation(); console.log("Mock export clicked"); }}
                          className="p-1.5 text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors border border-transparent rounded-full"
                        >
                          <span className="material-symbols-outlined text-[16px] block">download</span>
                        </button>
                      )}
                      <button
                        onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                        className={`px-4 py-1.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/15 hover:bg-[#e4e4e7] dark:hover:bg-white/10 text-carbon dark:text-bone font-dm-sans font-medium text-[12px] rounded-full transition-colors ${!isComplete ? "opacity-50 cursor-not-allowed" : ""
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



