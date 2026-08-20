import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { detections } from "../mockData";

export const Changes: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDetections = useMemo(() => {
    return detections.filter((item) => {
      const matchesSearch =
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.changeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.values.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory ? item.changeType === selectedCategory : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-xl bg-background">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-sm">
        <ol className="flex items-center space-x-2 font-body text-sm">
          <li>
            <Link to="/" className="text-primary hover:underline font-medium">Dashboard</Link>
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
          <h2 className="font-display-lg text-display-lg text-ink font-bold tracking-tight mb-xs">
            Intelligence Feed
          </h2>
          <p className="font-body text-body text-secondary">
            Real-time detection of pricing, plan, and feature shifts across tracked vendors.
          </p>
        </div>

        <div className="flex gap-sm shrink-0">
          <button
            onClick={() => alert("Exporting Intelligence Feed CSV...")}
            className="flex items-center space-x-xs px-sm py-xs bg-surface-pearl border border-hairline rounded-full font-label-capsule text-ink hover:bg-surface-container-high active:scale-[0.98] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center space-x-xs px-sm py-xs bg-surface-pearl border border-hairline rounded-full font-label-capsule text-ink hover:bg-surface-container-high active:scale-[0.98] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>View Settings</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-canvas-white border border-hairline rounded-lg p-sm flex flex-col md:flex-row items-center justify-between gap-sm shadow-sm">
        <div className="flex flex-wrap gap-sm items-center w-full md:w-auto">
          <span className="font-label-capsule text-secondary mr-xs flex items-center">
            <span className="material-symbols-outlined text-sm mr-1">filter_list</span>
            Filters:
          </span>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Intelligence..."
              className="w-full pl-9 pr-sm py-1.5 rounded-full border border-hairline bg-canvas-parchment focus:bg-canvas-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body text-[13px] transition-all"
            />
          </div>

          {/* Quick Filter Pill */}
          <button
            onClick={() => setSelectedCategory(selectedCategory ? null : "Plan Restructure")}
            className={`px-sm py-[6px] rounded-full border font-label-capsule flex items-center transition-colors text-sm ${
              selectedCategory === "Plan Restructure"
                ? "border-primary bg-primary-container/20 text-primary"
                : "border-hairline bg-surface-pearl text-ink hover:bg-surface-container-low"
            }`}
          >
            Category: Plan Shifts
            {selectedCategory === "Plan Restructure" && (
              <span className="material-symbols-outlined text-xs ml-1">close</span>
            )}
          </button>
        </div>

        <div className="w-full md:w-auto flex items-center space-x-sm border-t md:border-t-0 border-hairline pt-sm md:pt-0">
          <span className="font-data-tabular text-secondary text-[13px]">
            Showing {filteredDetections.length} detected events
          </span>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
        {filteredDetections.length === 0 ? (
          <div className="border border-hairline border-dashed rounded-lg p-section text-center bg-canvas-parchment/30 my-lg flex flex-col items-center">
            <div className="w-16 h-16 mb-md bg-surface-container-low rounded-full flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">search_off</span>
            </div>
            <h3 className="font-tagline text-[18px] text-ink font-semibold">No changes found</h3>
            <p className="font-body text-secondary text-[14px] mt-xs max-w-sm">
              No pricing detections match your filter criteria. Try clearing search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas-parchment border-b border-hairline font-label-capsule text-secondary text-[11px] uppercase tracking-wider">
                  <th className="p-md font-medium">Vendor</th>
                  <th className="p-md font-medium">Change Type</th>
                  <th className="p-md font-medium hidden sm:table-cell">Date Detected</th>
                  <th className="p-md font-medium text-right">Est. Impact</th>
                  <th className="p-md font-medium">Diff / Details</th>
                  <th className="p-md font-medium w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="font-data-tabular text-ink divide-y divide-hairline text-[13px]">
                {filteredDetections.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/intelligence/${row.id}`)}
                    className="hover:bg-surface-pearl transition-colors group cursor-pointer"
                  >
                    <td className="p-md">
                      <div className="flex items-center space-x-sm">
                        <div className="w-8 h-8 rounded bg-surface-container-low border border-hairline flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px] text-primary">{row.icon}</span>
                        </div>
                        <div>
                          <span className="font-body-strong block text-[14px] text-ink group-hover:text-primary transition-colors">
                            {row.vendor}
                          </span>
                          <span className="text-secondary text-[11px] flex items-center mt-[-2px]">
                            <div className="w-2 h-2 rounded-full bg-success-green mr-1"></div>
                            Scraper Active
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-md">
                      <span className={`inline-flex items-center px-2 py-1 rounded font-medium text-[11px] border ${row.changeTypeClass}`}>
                        {row.changeType}
                      </span>
                    </td>

                    <td className="p-md hidden sm:table-cell text-secondary">
                      Today, 09:41 AM
                    </td>

                    <td className={`p-md text-right font-body-strong text-[14px] ${row.impactClass}`}>
                      {row.impact}
                    </td>

                    <td className="p-md">
                      <div className="bg-canvas-parchment rounded p-xs border border-hairline font-data-tabular text-[12px] inline-block">
                        <span className="text-secondary line-through mr-2">$19.00/mo</span>
                        <span className="material-symbols-outlined text-[10px] text-secondary align-middle">arrow_forward</span>
                        <span className="text-critical-red font-medium ml-2">{row.values}</span>
                      </div>
                    </td>

                    <td className="p-md text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/intelligence/${row.id}`);
                        }}
                        className="flex items-center space-x-1 px-2 py-1 rounded border border-primary/20 text-primary hover:bg-surface-container-low active:scale-[0.98] transition-all text-[11px] font-medium"
                      >
                        <span>View</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};
