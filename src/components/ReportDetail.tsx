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
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4 text-[12px] text-[#6b7280] font-inter">
        <span className="hover:text-[#145aff] cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="hover:text-[#145aff] cursor-pointer transition-colors" onClick={() => navigate("/reports")}>Reports</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">{report.title}</span>
      </nav>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">
            {report.title}
          </h2>
          <p className="font-inter text-[14px] text-[#374151] mt-1">
            Data period: <span className="font-mono font-medium text-[#020520]">{report.dateRange}</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => console.log("Mock export CSV click")}
            className="px-6 py-2 bg-[#ffffff] border border-[#e2e8f0] text-[#020520] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150"
          >
            Export CSV
          </button>
          <button
            onClick={() => console.log("Mock export PDF click")}
            className="px-6 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
          >
            Export PDF Brief
          </button>
        </div>
      </div>

      {/* Key Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 font-inter">
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="font-mono text-[#6b7280] mb-1 text-[11px] uppercase tracking-wider">Total Changes</div>
          <div className="font-mono text-[24px] font-semibold text-[#020520]">42</div>
        </div>
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="font-mono text-[#6b7280] mb-1 text-[11px] uppercase tracking-wider">Est. Annual Impact</div>
          <div className="font-mono text-[24px] font-semibold text-[#f26052]">+$12,450.00</div>
        </div>
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="font-mono text-[#6b7280] mb-1 text-[11px] uppercase tracking-wider">Monitored Vendors</div>
          <div className="font-mono text-[24px] font-semibold text-[#020520]">12</div>
        </div>
      </div>

      {/* Line Item Changes Table */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] flex-grow">
        <div className="p-4 border-b border-[#e2e8f0] bg-[#f1f5f9]">
          <h3 className="font-inter text-[#020520] font-semibold text-[14px]">Detected pricing changes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] text-[#6b7280]">
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase">Vendor</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase">Parameter</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase">Change Type</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-right">Previous Value</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-right">New Value</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-center">Variance</th>
                <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-right">Annual Impact</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                const isIncrease = event.type === "Price Increase";
                return (
                  <tr key={index} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f0f4fe]/40 transition-colors">
                    <td className="py-3 px-4 font-inter text-[14px] text-[#020520] font-semibold">{event.vendor}</td>
                    <td className="py-3 px-4 font-mono text-[13px] text-[#374151]">{event.parameter}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${isIncrease ? "bg-[#f26052]/10 text-[#f26052]" : "bg-[#16ca2e]/10 text-[#16ca2e]"
                        }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[13px] text-[#6b7280] text-right">{event.prevVal}</td>
                    <td className="py-3 px-4 font-mono text-[13px] text-[#020520] font-semibold text-right">{event.newVal}</td>
                    <td className="py-3 px-4 font-mono text-[13px] text-center font-semibold">
                      <span className={isIncrease ? "text-[#f26052]" : "text-[#16ca2e]"}>
                        {event.percent}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[13px] text-right font-semibold">
                      <span className={isIncrease ? "text-[#f26052]" : "text-[#16ca2e]"}>
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

