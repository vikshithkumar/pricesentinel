import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { detections as initialDetections } from "../mockData";
import type { DetectionData } from "../mockData";
import { api } from "../services/api";
import type { AlertResponse } from "../services/api";

export const RecentDetections: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<DetectionData[]>(initialDetections);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    api.getAlerts()
      .then((alerts: AlertResponse[]) => {
        if (isMounted && alerts && alerts.length > 0) {
          const mapped: DetectionData[] = alerts.map((a) => {
            const isIncrease = a.type.includes("INCREASE") || a.impactSummary.startsWith("+");
            const isDecrease = a.impactSummary.startsWith("-");
            
            return {
              id: a.changeEventId,
              vendor: a.vendorName || "Unknown Vendor",
              changeType: a.type.replace(/_/g, " "),
              changeTypeClass: isIncrease
                ? "bg-[#f26052]/10 text-[#f26052]"
                : isDecrease
                ? "bg-[#16ca2e]/10 text-[#16ca2e]"
                : "bg-[#ffa64d]/10 text-[#ffa64d]",
              values: a.impactSummary || "Updated tier pricing",
              percentageChange: isIncrease ? "+15%" : isDecrease ? "-10%" : "N/A",
              severity: a.finalScore >= 75 ? "High" : a.finalScore >= 40 ? "Med" : "Low",
              severityClass: a.finalScore >= 75 ? "text-[#f26052]" : "text-[#ffa64d]",
              impact: a.impactSummary,
              impactClass: isIncrease ? "text-[#f26052]" : "text-[#16ca2e]",
              confidence: `${Math.round((a.confidence || 0.95) * 100)}%`,
              icon: a.vendorName === "AWS" ? "cloud" : a.vendorName === "OpenAI" ? "psychology" : "storefront",
            };
          });
          setItems(mapped);
        }
      })
      .catch((err) => {
        console.warn("Using local detections fallback", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] overflow-hidden flex flex-col">
      {/* Widget Header */}
      <div className="p-4 border-b border-[#e2e8f0] bg-[#f1f5f9] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-inter text-[16px] text-[#020520] font-semibold">
            Recent Detections
          </h3>
          {loading && (
            <span className="w-2 h-2 rounded-full bg-[#145aff] animate-ping"></span>
          )}
        </div>
        <Link to="/intelligence" className="text-[13px] font-inter font-medium text-[#145aff] hover:underline">
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap font-mono text-[13px]">
          <thead>
            <tr className="bg-[#f1f5f9] font-inter text-[12px] text-[#374151] border-b border-[#e2e8f0] font-medium uppercase tracking-wide">
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Change Type</th>
              <th className="py-3 px-4">Values</th>
              <th className="py-3 px-4">% Chg</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Impact</th>
              <th className="py-3 px-4">Conf.</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {items.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => navigate(`/intelligence/${row.id}`)}
                className="hover:bg-[#f0f4fe]/60 transition-colors duration-150 cursor-pointer group"
              >
                {/* Vendor name + icon */}
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f1f5f9] flex items-center justify-center border border-[#e2e8f0] shrink-0 text-[#145aff]">
                    <span className="material-symbols-outlined text-[14px]">{row.icon}</span>
                  </div>
                  <span className="font-inter font-semibold text-[#020520]">{row.vendor}</span>
                </td>

                {/* Change type status chip */}
                <td className="py-3.5 px-4 font-inter">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      row.changeType === "Price Increase" || row.changeType === "Fee Added" || row.changeType.includes("INCREASE")
                        ? "bg-[#f26052]/10 text-[#f26052]"
                        : row.changeType === "Price Decrease" || row.changeType.includes("DECREASE")
                          ? "bg-[#16ca2e]/10 text-[#16ca2e]"
                          : "bg-[#ffa64d]/10 text-[#ffa64d]"
                    }`}
                  >
                    {row.changeType}
                  </span>
                </td>

                {/* Values change representation */}
                <td className="py-3.5 px-4 text-[#374151]">{row.values}</td>

                {/* Percent change */}
                <td className={`py-3.5 px-4 font-semibold ${row.percentageChange.startsWith("+") ? "text-[#f26052]" : "text-[#16ca2e]"}`}>
                  {row.percentageChange}
                </td>

                {/* Severity level */}
                <td className="py-3.5 px-4 font-inter font-medium text-[#374151]">
                  {row.severity}
                </td>

                {/* Financial impact */}
                <td className="py-3.5 px-4 font-semibold text-[#f26052]">
                  {row.impact}
                </td>

                {/* Confidence score */}
                <td className="py-3.5 px-4 text-[#6b7280]">{row.confidence}</td>

                {/* Hover action triggers */}
                <td className="py-3.5 px-4 text-right font-inter">
                  {row.vendor === "OpenAI" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/scrapers");
                      }}
                      className="text-[#145aff] font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity mr-4 hover:underline"
                    >
                      View Health
                    </button>
                  )}
                  <Link
                    to={`/intelligence/${row.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#145aff] font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
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
