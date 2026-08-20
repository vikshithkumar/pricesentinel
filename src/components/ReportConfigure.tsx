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
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col items-center w-full max-w-[1400px] mx-auto">
      <div className="w-full max-w-xl bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 md:p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] mt-4 font-inter">
        {/* Header */}
        <div className="border-b border-[#e2e8f0] pb-4 mb-6">
          <h2 className="font-inter text-[24px] text-[#020520] font-semibold tracking-[-0.5px]">Configure New Report</h2>
          <p className="font-inter text-sm text-[#374151] mt-1">Setup pricing intelligence report metrics, scope, and automation schedule.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Title */}
          <div>
            <label className="block text-[#020520] text-[13px] font-medium mb-1">Report Title</label>
            <input
              required
              className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 font-inter text-[14px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all"
              type="text"
              placeholder="e.g. Q4 Infrastructure Spend Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#020520] text-[13px] font-medium mb-1">Category</label>
            <div className="relative">
              <select
                className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 pr-10 font-inter text-[14px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Financial">Financial Summaries</option>
                <option value="Executive">Executive Summaries</option>
                <option value="Technical">Technical Audits</option>
                <option value="All">All Reports</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-[#020520] text-[13px] font-medium mb-1">Schedule Frequency</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["daily", "weekly", "monthly"].map((sched) => (
                <label
                  key={sched}
                  className={`flex flex-col items-center justify-center p-4 border rounded-[12px] cursor-pointer transition-all ${schedule === sched
                      ? "border-[#145aff] bg-[#f0f4fe] text-[#145aff] font-medium"
                      : "border-[#e2e8f0] bg-[#ffffff] hover:bg-[#f1f5f9] text-[#374151]"
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
                  <span className="font-mono text-[12px] uppercase tracking-wider">{sched}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="text-[#374151] font-inter font-medium text-[14px] px-4 py-2 hover:bg-[#f0f4fe] rounded-full transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[14px] px-6 py-2 rounded-full hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
            >
              Configure Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

