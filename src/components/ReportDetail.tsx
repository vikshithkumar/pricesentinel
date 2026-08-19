import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockReports } from "../mockData";

export const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Retrieve current report metadata or fallback to default
  const report = mockReports.find((r) => r.id === id) || mockReports[0];

  // Mock list of events inside this report
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
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xxs mb-md text-[12px] text-secondary font-medium">
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-secondary text-[14px] select-none">chevron_right</span>
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/reports")}>Reports</span>
        <span className="material-symbols-outlined text-secondary text-[14px] select-none">chevron_right</span>
        <span className="text-ink">{report.title}</span>
      </nav>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md border-b border-hairline pb-md">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-ink font-bold tracking-tight">
            {report.title}
          </h2>
          <p className="font-body text-[14px] text-secondary mt-1">
            Data period: <span className="font-data-tabular font-medium text-ink">{report.dateRange}</span>
          </p>
        </div>
        <div className="flex gap-sm shrink-0">
          <button 
            onClick={() => console.log("Mock export CSV click")}
            className="px-md py-2 bg-surface-pearl border border-hairline text-ink rounded-full font-body-strong text-[13px] hover:bg-surface-container-low transition-colors"
          >
            Export CSV
          </button>
          <button 
            onClick={() => console.log("Mock export PDF click")}
            className="px-md py-2 bg-primary text-on-primary rounded-full font-body-strong text-[13px] hover:bg-surface-tint transition-all shadow-sm"
          >
            Export PDF Brief
          </button>
        </div>
      </div>

      {/* Key Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm mb-lg">
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px] uppercase tracking-wider">Total Changes</div>
          <div className="font-display-md text-[24px] font-bold text-ink">42</div>
        </div>
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px] uppercase tracking-wider">Est. Annual Impact</div>
          <div className="font-display-md text-[24px] font-bold text-error">+$12,450.00</div>
        </div>
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px] uppercase tracking-wider">Monitored Vendors</div>
          <div className="font-display-md text-[24px] font-bold text-ink">12</div>
        </div>
      </div>

      {/* Line Item Changes Table */}
      <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm flex-grow">
        <div className="p-md border-b border-hairline bg-canvas-parchment/50">
          <h3 className="font-body-strong text-ink font-semibold text-[14px]">Detected pricing changes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-parchment border-b border-hairline text-secondary">
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase">Vendor</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase">Parameter</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase">Change Type</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-right">Previous Value</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-right">New Value</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-center">Variance</th>
                <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-right">Annual Impact</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                const isIncrease = event.type === "Price Increase";
                return (
                  <tr key={index} className="border-b border-hairline last:border-0 hover:bg-surface-pearl group transition-colors">
                    <td className="py-3 px-md font-body-strong text-[14px] text-ink font-semibold">{event.vendor}</td>
                    <td className="py-3 px-md font-data-tabular text-[13px] text-secondary">{event.parameter}</td>
                    <td className="py-3 px-md">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isIncrease ? "bg-error-container text-on-error-container" : "bg-success-green/10 text-success-green"
                      }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="py-3 px-md font-data-tabular text-[13px] text-secondary text-right">{event.prevVal}</td>
                    <td className="py-3 px-md font-data-tabular text-[13px] text-ink font-semibold text-right">{event.newVal}</td>
                    <td className="py-3 px-md font-data-tabular text-[13px] text-center font-semibold">
                      <span className={isIncrease ? "text-critical-red" : "text-success-green"}>
                        {event.percent}
                      </span>
                    </td>
                    <td className="py-3 px-md font-data-tabular text-[13px] text-right font-semibold">
                      <span className={isIncrease ? "text-critical-red" : "text-success-green"}>
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
