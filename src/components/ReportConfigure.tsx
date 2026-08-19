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
    // Navigate back to reports page
    navigate("/reports");
  };

  return (
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col items-center">
      <div className="w-full max-w-xl bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm mt-md">
        
        {/* Header */}
        <div className="border-b border-hairline pb-md mb-lg">
          <h2 className="font-tagline text-[21px] text-ink font-bold">Configure New Report</h2>
          <p className="font-body text-sm text-secondary mt-xxs">Setup pricing intelligence report metrics, scope, and automation schedule.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Report Title */}
          <div>
            <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Report Title</label>
            <input 
              required
              className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 font-body text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
              type="text" 
              placeholder="e.g. Q4 Infrastructure Spend Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Category</label>
            <div className="relative">
              <select 
                className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 pr-10 font-body text-[14px] focus:outline-none focus:border-primary transition-colors appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Financial">Financial Summaries</option>
                <option value="Executive">Executive Summaries</option>
                <option value="Technical">Technical Audits</option>
                <option value="All">All Reports</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Schedule Frequency</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
              {["daily", "weekly", "monthly"].map((sched) => (
                <label 
                  key={sched}
                  className={`flex flex-col items-center justify-center p-md border rounded cursor-pointer transition-all ${
                    schedule === sched 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-hairline hover:bg-surface-container-low text-secondary"
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
                  <span className="material-symbols-outlined text-[20px] mb-xs">
                    {sched === "daily" ? "today" : sched === "weekly" ? "date_range" : "calendar_month"}
                  </span>
                  <span className="font-body-strong text-[12px] uppercase tracking-wider">{sched}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-sm pt-md border-t border-hairline">
            <button 
              type="button"
              onClick={() => navigate("/reports")}
              className="text-primary font-body-strong text-[14px] px-md py-2 hover:bg-primary/5 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary text-on-primary font-body-strong text-[14px] px-lg py-2 rounded-full hover:scale-95 transition-transform shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"
            >
              Configure Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
