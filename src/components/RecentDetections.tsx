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
                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                : isDecrease
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
              values: a.impactSummary || "Updated tier pricing",
              percentageChange: isIncrease ? "+15%" : isDecrease ? "-10%" : "N/A",
              severity: a.finalScore >= 75 ? "High" : a.finalScore >= 40 ? "Med" : "Low",
              severityClass: a.finalScore >= 75 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400",
              impact: a.impactSummary,
              impactClass: isIncrease ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400",
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
    <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 overflow-hidden flex flex-col shadow-sm dark:shadow-glass transition-colors duration-200">
      {/* Widget Header */}
      <div className="p-6 border-b border-bone-light dark:border-white/10 bg-vapor/40 dark:bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">
            Recent Detections
          </h3>
          {loading && (
            <span className="w-2 h-2 rounded-full bg-signal-blue dark:bg-[#6b62f2] animate-ping"></span>
          )}
        </div>
        <Link to="/intelligence" className="text-[13px] font-dm-sans font-medium text-signal-blue dark:text-bone hover:text-deep-dusk dark:hover:text-white underline underline-offset-4 decoration-signal-blue/30 dark:decoration-white/30 hover:decoration-signal-blue dark:hover:decoration-white transition-colors">
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap font-dm-sans text-[13px]">
          <thead>
            <tr className="bg-vapor dark:bg-white/[0.01] font-dm-sans text-[12px] text-steel dark:text-ash border-b border-bone-light dark:border-white/10 font-medium uppercase tracking-wider">
              <th className="py-3.5 px-6">Vendor</th>
              <th className="py-3.5 px-6">Change Type</th>
              <th className="py-3.5 px-6">Values</th>
              <th className="py-3.5 px-6">% Chg</th>
              <th className="py-3.5 px-6">Severity</th>
              <th className="py-3.5 px-6">Impact</th>
              <th className="py-3.5 px-6">Conf.</th>
              <th className="py-3.5 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-light/60 dark:divide-white/5">
            {items.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => navigate(`/intelligence/${row.id}`)}
                className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer group"
              >
                {/* Vendor name + icon */}
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center shrink-0 text-carbon dark:text-bone group-hover:bg-[#e4e4e7] dark:group-hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">{row.icon}</span>
                  </div>
                  <span className="font-geist font-medium text-ink-black dark:text-bone">{row.vendor}</span>
                </td>

                {/* Change type status chip */}
                <td className="py-4 px-6 font-dm-sans">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border ${
                      row.changeType === "Price Increase" || row.changeType === "Fee Added" || row.changeType.includes("INCREASE")
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        : row.changeType === "Price Decrease" || row.changeType.includes("DECREASE")
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                    }`}
                  >
                    {row.changeType}
                  </span>
                </td>

                {/* Values change representation */}
                <td className="py-4 px-6 text-steel dark:text-ash font-geist text-[13px]">{row.values}</td>

                {/* Percent change */}
                <td className={`py-4 px-6 font-geist font-medium ${row.percentageChange.startsWith("+") ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                  {row.percentageChange}
                </td>

                {/* Severity level */}
                <td className="py-4 px-6 font-dm-sans font-medium text-steel dark:text-ash">
                  {row.severity}
                </td>

                {/* Financial impact */}
                <td className="py-4 px-6 font-geist font-medium text-red-600 dark:text-red-400">
                  {row.impact}
                </td>

                {/* Confidence score */}
                <td className="py-4 px-6 text-steel dark:text-slate font-geist text-[12px]">{row.confidence}</td>

                {/* Hover action triggers */}
                <td className="py-4 px-6 text-right font-dm-sans">
                  {row.vendor === "OpenAI" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/scrapers");
                      }}
                      className="text-signal-blue dark:text-bone font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity mr-4 hover:underline"
                    >
                      View Health
                    </button>
                  )}
                  <Link
                    to={`/intelligence/${row.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-signal-blue dark:text-bone font-medium text-[12px] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
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


