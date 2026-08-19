import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changeDetails } from "../mockData";

export const Changes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("DevTools"); // Matches Stitch default filter

  // Convert map to array for listing
  const events = useMemo(() => Object.values(changeDetails), []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Search term match (Vendor Name or Title)
      const matchesSearch =
        ev.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

      // Category match
      let matchesCategory = true;
      if (selectedCategory) {
        // Find category from vendor info or match based on tags
        const categoryMap: Record<string, string> = {
          "OpenAI": "AI Infrastructure",
          "AWS": "AI Infrastructure",
          "Twilio": "DevTools",
          "MongoDB": "DevTools",
          "CloudForge Inc.": "DevTools",
          "SynthText API": "AI Infrastructure",
          "DataLake Co.": "DevTools",
          "BuildOps": "DevTools"
        };
        const category = categoryMap[ev.vendorName] || "DevTools";
        matchesCategory = category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-background">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-sm">
        <ol className="flex items-center space-x-2 font-body text-sm">
          <li>
            <Link to="/" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="text-secondary">
            <span className="mx-1">/</span>
          </li>
          <li className="text-ink font-medium" aria-current="page">
            Intelligence Feed
          </li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
        <div>
          <h2 className="font-display-lg text-[32px] md:text-display-lg font-bold text-ink tracking-tight mb-xs">
            Intelligence Feed
          </h2>
          <p className="font-body text-body text-secondary">
            Real-time detection of pricing, plan, and feature shifts across tracked vendors.
          </p>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center space-x-xs px-sm py-1.5 bg-surface-pearl border border-hairline rounded-full font-label-capsule text-ink hover:bg-surface-variant transition-colors text-[13px] font-medium">
            <span className="material-symbols-outlined text-[16px] mr-1">download</span>
            <span>Export CSV</span>
          </button>
          <Link
            to="/settings"
            className="flex items-center space-x-xs px-sm py-1.5 bg-surface-pearl border border-hairline rounded-full font-label-capsule text-ink hover:bg-surface-variant transition-colors text-[13px] font-medium"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">tune</span>
            <span>View Settings</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-canvas-white border border-hairline rounded-lg p-sm flex flex-col md:flex-row items-center justify-between gap-sm shadow-sm mb-gutter">
        <div className="flex flex-wrap gap-sm items-center w-full md:w-auto">
          <span className="font-label-capsule text-secondary mr-xs flex items-center text-[13px]">
            <span className="material-symbols-outlined text-[16px] mr-1">filter_list</span>
            <span>Filters:</span>
          </span>

          {/* Watchlist Filter Dropdown */}
          <div className="relative">
            <button className="px-sm py-[6px] rounded-full border border-hairline bg-surface-pearl text-ink font-label-capsule flex items-center hover:bg-surface-variant transition-colors text-sm">
              Watchlists{" "}
              <span className="material-symbols-outlined text-xs ml-1">arrow_drop_down</span>
            </button>
          </div>

          {/* Active Category Filter chip toggle */}
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-sm py-[6px] rounded-full border border-primary bg-primary-fixed-dim/20 text-primary font-label-capsule flex items-center hover:bg-primary-fixed-dim/30 transition-colors text-sm font-semibold"
            >
              Category: {selectedCategory}{" "}
              <span className="material-symbols-outlined text-xs ml-1">close</span>
            </button>
          ) : (
            <div className="flex gap-1.5">
              {["DevTools", "AI Infrastructure"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-sm py-[6px] rounded-full border border-hairline bg-surface-pearl text-ink font-label-capsule flex items-center hover:bg-surface-variant transition-colors text-sm"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Magnitude Filter Dropdown */}
          <div className="relative">
            <button className="px-sm py-[6px] rounded-full border border-hairline bg-surface-pearl text-ink font-label-capsule flex items-center hover:bg-surface-variant transition-colors text-sm">
              Change Magnitude{" "}
              <span className="material-symbols-outlined text-xs ml-1">arrow_drop_down</span>
            </button>
          </div>
        </div>

        {/* Search & Event Count */}
        <div className="w-full md:w-auto flex items-center gap-sm border-t md:border-t-0 border-hairline pt-sm md:pt-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[16px]">
              search
            </span>
            <input
              className="pl-8 pr-sm py-1.5 rounded-full border border-hairline bg-canvas-parchment focus:bg-canvas-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] w-48 md:w-64 transition-all"
              placeholder="Search feed..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="font-data-tabular text-secondary text-[13px] shrink-0">
            Showing {filteredEvents.length} detected events
          </span>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-parchment border-b border-hairline font-label-capsule text-secondary text-[13px] uppercase tracking-wide font-semibold">
                <th className="p-md py-3 px-4">Vendor</th>
                <th className="p-md py-3 px-4">Change Type</th>
                <th className="p-md py-3 px-4 hidden sm:table-cell">Date Detected</th>
                <th className="p-md py-3 px-4 text-right">Est. Impact</th>
                <th className="p-md py-3 px-4">Diff / Details</th>
                <th className="p-md py-3 px-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-ink divide-y divide-hairline text-[13px]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-secondary">
                    No intelligence events match your criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((row) => {
                  const isPriceIncrease = row.title.includes("Increase") || row.title.includes("Adjustment");
                  const isPriceDecrease = row.title.includes("Decrease") || row.title.includes("Drop");

                  let typeBg = "bg-surface-container-high border-outline/20 text-ink";
                  let typeLabel = "Plan Restructure";
                  let typeIcon = "tune";

                  if (isPriceIncrease) {
                    typeBg = "bg-error-container text-on-error-container border-error/20";
                    typeLabel = "Price Increase";
                    typeIcon = "trending_up";
                  } else if (isPriceDecrease) {
                    typeBg = "bg-success-green/10 text-success-green border-success-green/20";
                    typeLabel = "Price Decrease";
                    typeIcon = "trending_down";
                  } else if (row.title.includes("Credit")) {
                    typeBg = "bg-primary-fixed-dim/20 text-primary border-primary/20";
                    typeLabel = "New Credit Model";
                    typeIcon = "toll";
                  }

                  const firstMetric = row.metrics[0];

                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/intelligence/${row.id}`)}
                      className="hover:bg-surface-bright transition-colors group cursor-pointer"
                    >
                      {/* Vendor Logo & Name */}
                      <td className="p-md py-4 px-4">
                        <div className="flex items-center space-x-sm">
                          <div className="w-8 h-8 rounded bg-surface-variant border border-hairline flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {row.vendorLogoIcon || "storefront"}
                            </span>
                          </div>
                          <div>
                            <span className="font-body-strong block text-[15px] font-semibold text-ink group-hover:text-primary transition-colors">
                              {row.vendorName}
                            </span>
                            <span className="text-secondary text-[11px] flex items-center mt-0.5">
                              <span className="w-2 h-2 rounded-full bg-success-green mr-1.5"></span>
                              Scraper Active
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Change Type chip */}
                      <td className="p-md py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded font-medium text-[11px] border ${typeBg}`}
                        >
                          <span className="material-symbols-outlined text-[14px] mr-1">
                            {typeIcon}
                          </span>
                          {typeLabel}
                        </span>
                      </td>

                      {/* Date Detected */}
                      <td className="p-md py-4 px-4 hidden sm:table-cell text-secondary">
                        {row.timeText.replace("Detected ", "").split(" via ")[0]}
                      </td>

                      {/* Est. Impact */}
                      <td
                        className={`p-md py-4 px-4 text-right font-body-strong text-[14px] font-bold ${
                          row.monthlyDelta.startsWith("+") || row.monthlyDelta.startsWith("-")
                            ? row.monthlyDelta.startsWith("+")
                              ? "text-success-green"
                              : "text-critical-red"
                            : "text-secondary"
                        }`}
                      >
                        {row.monthlyDelta === "$0" ? "N/A" : row.monthlyDelta}
                      </td>

                      {/* Diff Preview */}
                      <td className="p-md py-4 px-4 max-w-xs md:max-w-md">
                        {firstMetric && (firstMetric.previous !== "" || firstMetric.current !== "") ? (
                          <div className="bg-canvas-parchment rounded p-1 border border-hairline font-mono text-[11px] inline-block mb-1">
                            <span className="text-secondary line-through mr-1.5">
                              {firstMetric.previous}
                            </span>
                            <span className="material-symbols-outlined text-[10px] text-outline align-middle">
                              arrow_forward
                            </span>
                            <span
                              className={`font-semibold ml-1.5 ${
                                firstMetric.status === "critical"
                                  ? "text-critical-red"
                                  : firstMetric.status === "success"
                                  ? "text-success-green"
                                  : "text-ink"
                              }`}
                            >
                              {firstMetric.current}
                            </span>
                          </div>
                        ) : null}
                        <div className="text-[11px] text-secondary truncate max-w-sm">
                          {row.subtitle}
                        </div>
                      </td>

                      {/* Action Chevron */}
                      <td className="p-md py-4 px-4 text-center">
                        <button className="flex items-center space-x-1 px-2 py-1 rounded border border-primary/20 text-primary hover:bg-primary-fixed-dim/20 transition-colors text-[11px] font-semibold">
                          <span>View</span>
                          <span className="material-symbols-outlined text-[14px]">
                            chevron_right
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-canvas-parchment border-t border-hairline p-sm flex items-center justify-between text-data-tabular text-[13px]">
          <span className="text-secondary">
            Showing 1 to {filteredEvents.length} of {filteredEvents.length} entries
          </span>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 border border-hairline bg-canvas-white rounded hover:bg-surface-variant text-outline disabled:opacity-50"
              disabled
            >
              Prev
            </button>
            <button className="px-3 py-1 border border-primary bg-primary text-canvas-white rounded">
              1
            </button>
            <button
              className="px-3 py-1 border border-hairline bg-canvas-white rounded hover:bg-surface-variant text-outline disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
