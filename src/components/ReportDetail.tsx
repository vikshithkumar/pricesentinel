import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockReports } from "../mockData";

export const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const report = mockReports.find((r) => r.id === id) || mockReports[0];

  const events = [
    {
      vendor: "OpenAI",
      parameter: "GPT-4 Input (1K tokens)",
      type: "Price Increase",
      prevVal: "$0.0300",
      newVal: "$0.0345",
      percent: "+15%",
      delta: "+$12,450.00"
    },
    {
      vendor: "OpenAI",
      parameter: "GPT-4 Output (1K tokens)",
      type: "Price Increase",
      prevVal: "$0.0600",
      newVal: "$0.0690",
      percent: "+15%",
      delta: "+$8,200.00"
    },
    {
      vendor: "AWS",
      parameter: "EC2 m5.large (Linux, hourly)",
      type: "Price Decrease",
      prevVal: "$0.0960",
      newVal: "$0.0912",
      percent: "-5%",
      delta: "-$2,450.00"
    },
    {
      vendor: "Twilio",
      parameter: "SMS API Call (United States)",
      type: "Price Decrease",
      prevVal: "$0.0079",
      newVal: "$0.0075",
      percent: "-5.1%",
      delta: "-$6,200.00"
    }
  ];

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3 text-[12px] text-steel dark:text-slate font-dm-sans">
        <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/reports")}>Reports</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-carbon dark:text-bone font-medium">{report.title}</span>
      </nav>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">
            {report.title}
          </h2>
          <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-1">
            Data period: <span className="font-geist font-medium text-carbon dark:text-bone">{report.dateRange}</span>
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={() => console.log("Mock export CSV click")}
            className="px-5 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone rounded-full font-dm-sans font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => console.log("Mock export PDF click")}
            className="px-5 py-2.5 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-full font-dm-sans font-medium text-[13px] transition-colors shadow-sm"
          >
            Export PDF Brief
          </button>
        </div>
      </div>

      {/* Key Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 font-dm-sans">
        <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
          <div className="font-dm-sans text-steel dark:text-ash mb-1 text-[12px] uppercase tracking-wider font-medium">Total Changes</div>
          <div className="font-geist text-[28px] font-medium text-ink-black dark:text-bone">42</div>
        </div>
        <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
          <div className="font-dm-sans text-steel dark:text-ash mb-1 text-[12px] uppercase tracking-wider font-medium">Est. Annual Impact</div>
          <div className="font-geist text-[28px] font-medium text-red-600 dark:text-red-400">+$12,450.00</div>
        </div>
        <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
          <div className="font-dm-sans text-steel dark:text-ash mb-1 text-[12px] uppercase tracking-wider font-medium">Monitored Vendors</div>
          <div className="font-geist text-[28px] font-medium text-ink-black dark:text-bone">12</div>
        </div>
      </div>

      {/* Line Item Changes Table */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm dark:shadow-glass flex-grow">
        <div className="p-5 border-b border-bone-light dark:border-white/10 bg-vapor/40 dark:bg-white/[0.02]">
          <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Detected pricing changes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-dm-sans text-[13px]">
            <thead>
              <tr className="bg-vapor dark:bg-white/[0.01] border-b border-bone-light dark:border-white/10 text-steel dark:text-ash uppercase tracking-wider font-dm-sans text-[12px]">
                <th className="py-4 px-5">Vendor</th>
                <th className="py-4 px-5">Parameter</th>
                <th className="py-4 px-5">Change Type</th>
                <th className="py-4 px-5 text-right">Previous Value</th>
                <th className="py-4 px-5 text-right">New Value</th>
                <th className="py-4 px-5 text-center">Variance</th>
                <th className="py-4 px-5 text-right">Annual Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone-light/60 dark:divide-white/5 text-carbon dark:text-bone">
              {events.map((event, index) => {
                const isIncrease = event.type === "Price Increase";
                return (
                  <tr key={index} className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors">
                    <td className="py-4 px-5 font-geist font-medium text-ink-black dark:text-bone">{event.vendor}</td>
                    <td className="py-4 px-5 font-geist text-steel dark:text-ash">{event.parameter}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border ${isIncrease ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-geist text-steel dark:text-slate text-right">{event.prevVal}</td>
                    <td className="py-4 px-5 font-geist text-carbon dark:text-bone font-medium text-right">{event.newVal}</td>
                    <td className="py-4 px-5 font-geist text-center font-medium">
                      <span className={isIncrease ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}>
                        {event.percent}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-geist text-right font-medium">
                      <span className={isIncrease ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}>
                        {event.delta}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};



