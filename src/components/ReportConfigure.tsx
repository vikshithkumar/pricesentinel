import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ReportConfigure: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Financial");
  const [schedule, setSchedule] = useState<string>("weekly");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mock report configured:", { title, category, schedule });
    navigate("/reports");
  };

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col items-center w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      <div className="w-full max-w-xl bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass mt-4 font-dm-sans">
        {/* Header */}
        <div className="border-b border-bone-light dark:border-white/10 pb-5 mb-6">
          <h2 className="font-geist text-[24px] text-ink-black dark:text-bone font-medium tracking-tight">Configure New Report</h2>
          <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Setup pricing intelligence report metrics, scope, and automation schedule.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Title */}
          <div>
            <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-2">Report Title</label>
            <input
              required
              className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[14px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
              type="text"
              placeholder="e.g. Q4 Infrastructure Spend Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-2">Category</label>
            <div className="relative">
              <select
                className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 pr-10 font-dm-sans text-[14px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Financial" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Financial Summaries</option>
                <option value="Executive" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Executive Summaries</option>
                <option value="Technical" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Technical Audits</option>
                <option value="All" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">All Reports</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-2">Schedule Frequency</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["daily", "weekly", "monthly"].map((sched) => (
                <label
                  key={sched}
                  className={`flex flex-col items-center justify-center p-4 border rounded-[16px] cursor-pointer transition-all ${schedule === sched
                      ? "border-signal-blue/30 bg-signal-blue/15 text-signal-blue dark:border-white/30 dark:bg-white/10 dark:text-white font-medium shadow-sm"
                      : "border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 hover:bg-[#e4e4e7] dark:hover:bg-white/10 text-steel dark:text-ash"
                    }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    value={sched}
                    className="hidden"
                    checked={schedule === sched}
                    onChange={() => setSchedule(sched)}
                  />
                  <span className="material-symbols-outlined text-[20px] mb-1">
                    {sched === "daily" ? "today" : sched === "weekly" ? "date_range" : "calendar_month"}
                  </span>
                  <span className="font-geist text-[12px] uppercase tracking-wider">{sched}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t border-bone-light dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="text-steel dark:text-ash font-dm-sans font-medium text-[14px] px-5 py-2.5 hover:text-carbon dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] px-6 py-2.5 rounded-full transition-all shadow-sm"
            >
              Configure Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};



