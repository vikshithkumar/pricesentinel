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
    <main className="flex-grow overflow-y-auto bg-[#fcfcfc] flex flex-col md:flex-row h-full w-full max-w-[1400px] mx-auto">
      {/* Reports Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#e2e8f0] bg-[#ffffff] py-6 px-4 md:px-6 flex-shrink-0 font-inter">
        <div className="mb-6">
          <h3 className="text-[#020520] mb-2 uppercase tracking-wider text-[11px] font-semibold">Categories</h3>
          <ul className="space-y-1">
            {["All", "Executive", "Technical", "Financial"].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-full text-[13px] transition-colors duration-150 ${activeCategory === cat
                      ? "bg-[#f0f4fe] text-[#145aff] font-medium"
                      : "hover:bg-[#f0f4fe]/60 text-[#374151]"
                    }`}
                >
                  {cat === "All" ? "All Reports" : `${cat} Summaries`}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#020520] mb-2 uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#6b7280]">schedule</span>
            Saved Schedules
          </h3>
          <ul className="space-y-2">
            <li>
              <div className="px-3 py-2 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] flex justify-between items-center group cursor-pointer hover:border-[#145aff]/30 transition-colors">
                <div>
                  <p className="font-inter text-[13px] text-[#020520] font-medium">Weekly C-Suite</p>
                  <p className="font-mono text-[11px] text-[#6b7280]">Mondays, 8:00 AM</p>
                </div>
                <span className="material-symbols-outlined text-[#6b7280] group-hover:text-[#145aff] transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
            <li>
              <div className="px-3 py-2 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] flex justify-between items-center group cursor-pointer hover:border-[#145aff]/30 transition-colors">
                <div>
                  <p className="font-inter text-[13px] text-[#020520] font-medium">EOM Procurement</p>
                  <p className="font-mono text-[11px] text-[#6b7280]">Last Day, 5:00 PM</p>
                </div>
                <span className="material-symbols-outlined text-[#6b7280] group-hover:text-[#145aff] transition-colors text-[18px]">more_vert</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Reports Grid Area */}
      <section className="flex-grow p-4 md:p-10 bg-[#fcfcfc]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4 text-[12px] text-[#6b7280] font-inter">
          <span className="hover:text-[#145aff] cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#020520] font-medium">Reports</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#e2e8f0] pb-6">
          <div>
            <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">Reports</h2>
            <p className="font-inter text-[14px] text-[#374151] mt-1">Executive-ready pricing intelligence summaries.</p>
          </div>
          <button
            onClick={() => navigate("/reports/configure")}
            className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[13px] px-6 py-2 rounded-full flex items-center gap-1.5 hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Generate New Report
          </button>
        </div>

        {/* Bento Grid */}
        {filteredReports.length === 0 ? (
          <div className="border border-[#e2e8f0] border-dashed rounded-[16px] p-10 text-center bg-[#ffffff] shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#6b7280]">
              <span className="material-symbols-outlined text-[36px]">assessment</span>
            </div>
            <h3 className="font-inter text-[18px] text-[#020520] font-semibold">No reports found</h3>
            <p className="font-inter text-[#6b7280] text-[14px] mt-1 max-w-sm">
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
                  className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 flex flex-col justify-between hover:border-[#145aff]/40 transition-colors duration-150 cursor-pointer relative shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 font-inter">
                      <span className="px-2.5 py-0.5 bg-[#f1f5f9] text-[#374151] text-[11px] font-medium rounded-full border border-[#e2e8f0] uppercase">
                        {report.category}
                      </span>
                      <span className={`flex items-center gap-1 text-[12px] font-medium ${isComplete ? "text-[#16ca2e]" : isWarning ? "text-[#ffa64d]" : "text-[#6b7280]"
                        }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {isComplete ? "check_circle" : isWarning ? "warning" : "event"}
                        </span>
                        {report.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                      className="font-inter text-[18px] text-[#020520] tracking-tight mb-1 font-semibold hover:text-[#145aff] transition-colors"
                    >
                      {report.title}
                    </h3>
                    <p className="font-mono text-[13px] text-[#6b7280] mb-4">{report.dateRange}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6 border-t border-[#e2e8f0] pt-3 font-mono">
                      {isComplete && (
                        <>
                          <div>
                            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Changes</p>
                            <p className="text-[20px] font-semibold text-[#020520]">{report.changesCount}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Impact</p>
                            <p className="text-[20px] font-semibold text-[#145aff]">{report.impactText}</p>
                          </div>
                        </>
                      )}

                      {isScheduled && (
                        <div className="col-span-2 font-inter">
                          <p className="text-[10px] text-[#6b7280] font-mono uppercase tracking-wider mb-1">Status</p>
                          <p className="text-[14px] text-[#020520]">Scheduled run active</p>
                        </div>
                      )}

                      {isWarning && (
                        <>
                          <div>
                            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Uptime</p>
                            <p className="text-[20px] font-semibold text-[#020520]">{report.uptimeText}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Failures</p>
                            <p className="text-[20px] font-semibold text-[#f26052]">{report.failuresCount}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-[#e2e8f0] pt-3 mt-auto font-inter">
                    <p className="font-mono text-[11px] text-[#6b7280]">
                      {isScheduled ? `Runs: ${report.runsTimeText}` : `Generated: ${report.generatedTimeText}`}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        aria-label="Schedule"
                        onClick={(e) => { e.stopPropagation(); console.log("Schedule clicked"); }}
                        className={`p-1.5 text-[#6b7280] hover:text-[#145aff] transition-colors border ${isScheduled ? "border-[#e2e8f0] bg-[#f0f4fe] text-[#145aff]" : "border-transparent"} rounded-full`}
                      >
                        <span className="material-symbols-outlined text-[16px] block">schedule</span>
                      </button>
                      {isComplete && (
                        <button
                          aria-label="Export"
                          onClick={(e) => { e.stopPropagation(); console.log("Mock export clicked"); }}
                          className="p-1.5 text-[#6b7280] hover:text-[#145aff] transition-colors border border-transparent rounded-full"
                        >
                          <span className="material-symbols-outlined text-[16px] block">download</span>
                        </button>
                      )}
                      <button
                        onClick={() => isComplete && navigate(`/reports/detail/${report.id}`)}
                        className={`px-3 py-1 bg-[#fcfcfc] border border-[#145aff] hover:bg-[#f0f4fe] text-[#145aff] font-inter font-medium text-[12px] rounded-full transition-colors duration-150 ${!isComplete ? "opacity-50 cursor-not-allowed" : ""
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

