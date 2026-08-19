import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { detections } from "../mockData";

export const RecentDetections: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-canvas-white rounded-xl border border-hairline shadow-sm overflow-hidden flex flex-col">
      {/* Widget Header */}
      <div className="p-md border-b border-hairline bg-canvas-parchment/50 flex justify-between items-center">
        <h3 className="font-body-strong text-[16px] text-ink font-semibold">
          Recent Detections
        </h3>
        <Link to="/intelligence" className="text-[13px] font-medium text-primary hover:underline">
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface-pearl font-data-tabular text-[12px] text-secondary border-b border-hairline uppercase tracking-wide">
              <th className="py-3 px-4 font-medium">Vendor</th>
              <th className="py-3 px-4 font-medium">Change Type</th>
              <th className="py-3 px-4 font-medium">Values</th>
              <th className="py-3 px-4 font-medium">% Chg</th>
              <th className="py-3 px-4 font-medium">Severity</th>
              <th className="py-3 px-4 font-medium">Impact</th>
              <th className="py-3 px-4 font-medium">Conf.</th>
              <th className="py-3 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="font-data-tabular text-[13px]">
            {detections.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => navigate(`/intelligence/${row.id}`)}
                className="border-b border-hairline hover:bg-surface-container-low transition-colors cursor-pointer group"
              >
                {/* Vendor name + icon */}
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-surface-container flex items-center justify-center border border-hairline shrink-0">
                    <span className="material-symbols-outlined text-[14px]">{row.icon}</span>
                  </div>
                  <span className="font-medium text-ink">{row.vendor}</span>
                </td>

                {/* Change type status chip */}
                <td className="py-3 px-4">
                  <span
                    className={`border px-2 py-0.5 rounded text-[11px] font-semibold ${row.changeTypeClass}`}
                  >
                    {row.changeType}
                  </span>
                </td>

                {/* Values change representation */}
                <td className="py-3 px-4 text-secondary">{row.values}</td>

                {/* Percent change */}
                <td className={`py-3 px-4 font-medium ${row.percentageChangeClass || "text-ink"}`}>
                  {row.percentageChange}
                </td>

                {/* Severity level */}
                <td className={`py-3 px-4 font-medium ${row.severityClass}`}>
                  {row.severity}
                </td>

                {/* Financial impact */}
                <td className={`py-3 px-4 font-medium ${row.impactClass}`}>
                  {row.impact}
                </td>

                {/* Confidence score */}
                <td className="py-3 px-4 text-secondary">{row.confidence}</td>

                {/* Hover action triggers */}
                <td className="py-3 px-4 text-right">
                  {row.vendor === "OpenAI" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/vendors");
                      }}
                      className="text-primary font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity mr-4 hover:underline"
                    >
                      View Health
                    </button>
                  )}
                  <Link
                    to={`/intelligence/${row.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
