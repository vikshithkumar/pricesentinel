import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { vendors } from "../mockData";

export const Vendors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<"Live" | "Degraded" | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<boolean>(false);

  // Client-side filtering
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // Search matches name, category, or plan
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pricingPlan.toLowerCase().includes(searchTerm.toLowerCase());

      // Category matches
      const matchesCategory = selectedCategory ? v.category === selectedCategory : true;

      // Health matches
      let matchesHealth = true;
      if (selectedHealth === "Live") {
        matchesHealth = v.scraperHealth >= 96.0 && v.status !== "Offline";
      } else if (selectedHealth === "Degraded") {
        matchesHealth = v.scraperHealth < 96.0 || v.status === "Offline";
      }

      // Impact matches (High Impact: impact >= $15,000 or <= -$10,000)
      let matchesImpact = true;
      if (selectedImpact) {
        if (v.annualImpact === "--") {
          matchesImpact = false;
        } else {
          const val = parseInt(v.annualImpact.replace(/[^0-9-]/g, ""), 10);
          matchesImpact = Math.abs(val) >= 15000;
        }
      }

      return matchesSearch && matchesCategory && matchesHealth && matchesImpact;
    });
  }, [searchTerm, selectedCategory, selectedHealth, selectedImpact]);

  // Toast alert for unimplemented button
  const handleAddVendor = () => {
    alert("Add Vendor modal will be implemented in a future batch.");
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-background flex flex-col gap-lg overflow-y-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs mb-xs" aria-label="Breadcrumb">
        <Link to="/" className="font-body text-sm text-secondary hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
        <span className="font-body-strong text-sm text-ink font-semibold">Vendors</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md border-b border-hairline pb-lg shrink-0">
        <div>
          <h2 className="font-display-lg text-[32px] md:text-display-lg font-bold text-ink tracking-tight">
            Vendor Portfolio
          </h2>
          <p className="font-body text-body text-secondary mt-xs">
            Total Vendors: {filteredVendors.length}
          </p>
        </div>
        <button
          onClick={handleAddVendor}
          className="bg-primary text-on-primary font-body-strong text-[14px] font-semibold rounded-full py-2 px-6 hover:bg-surface-tint transition-colors flex items-center gap-xs self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-surface-pearl border border-hairline rounded-lg p-sm flex flex-col lg:flex-row gap-sm items-start lg:items-center justify-between shrink-0 shadow-sm">
        {/* Search */}
        <div className="relative w-full lg:w-96 flex-shrink-0">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-md py-1.5 bg-canvas-white border border-hairline rounded-md font-body text-[14px] text-ink placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Search vendors, categories, plans..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter chips scroll container */}
        <div className="flex flex-wrap items-center gap-sm w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide text-[13px]">
          {/* Categories group */}
          <div className="flex items-center gap-xs border-r border-hairline pr-sm">
            <span className="font-label-capsule text-secondary whitespace-nowrap font-medium">
              Category:
            </span>
            {["AI Infrastructure", "CRM", "DevTools"].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`px-3 py-1 rounded-full font-label-capsule text-[12px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-on-primary border border-primary font-semibold"
                      : "bg-canvas-white border border-hairline text-ink hover:bg-canvas-parchment"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Health states group */}
          <div className="flex items-center gap-xs border-r border-hairline pr-sm">
            <span className="font-label-capsule text-secondary whitespace-nowrap font-medium">
              Health:
            </span>
            <button
              onClick={() => setSelectedHealth(selectedHealth === "Live" ? null : "Live")}
              className={`px-3 py-1 border rounded-full font-label-capsule text-[12px] flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                selectedHealth === "Live"
                  ? "bg-primary text-on-primary border-primary font-semibold"
                  : "bg-canvas-white border-hairline text-ink hover:bg-canvas-parchment"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${selectedHealth === "Live" ? "bg-canvas-white" : "bg-success-green"}`}></span>
              <span>Live</span>
            </button>
            <button
              onClick={() => setSelectedHealth(selectedHealth === "Degraded" ? null : "Degraded")}
              className={`px-3 py-1 border rounded-full font-label-capsule text-[12px] flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                selectedHealth === "Degraded"
                  ? "bg-primary text-on-primary border-primary font-semibold"
                  : "bg-canvas-white border-hairline text-ink hover:bg-canvas-parchment"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${selectedHealth === "Degraded" ? "bg-canvas-white" : "bg-warning-amber"}`}></span>
              <span>Degraded</span>
            </button>
          </div>

          {/* Impact state group */}
          <div className="flex items-center gap-xs">
            <span className="font-label-capsule text-secondary whitespace-nowrap font-medium">
              Impact:
            </span>
            <button
              onClick={() => setSelectedImpact(!selectedImpact)}
              className={`px-3 py-1 border rounded-full font-label-capsule text-[12px] transition-colors whitespace-nowrap ${
                selectedImpact
                  ? "bg-primary text-on-primary border-primary font-semibold"
                  : "bg-canvas-white border-hairline text-ink hover:bg-canvas-parchment"
              }`}
            >
              High Impact
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Data Table Container */}
      <div className="bg-canvas-white rounded-lg border border-hairline overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto table-container flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-canvas-parchment border-b border-hairline font-label-capsule text-secondary text-[12px] uppercase font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Vendor</th>
                <th className="py-3 px-4 whitespace-nowrap">Category</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Pricing Plan</th>
                <th className="py-3 px-4 whitespace-nowrap">Recent Changes</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Annual Impact</th>
                <th className="py-3 px-4 whitespace-nowrap text-center">Scraper Health</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline font-data-tabular text-[13px] text-ink">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-secondary">
                    No vendors match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((row) => {
                  const isIncrease = row.impactType === "increase";
                  const isDecrease = row.impactType === "decrease";
                  const impactColor = isIncrease
                    ? "text-critical-red"
                    : isDecrease
                    ? "text-success-green"
                    : "text-secondary";

                  const statusClass =
                    row.status === "Active"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed font-semibold"
                      : row.status === "Syncing"
                      ? "bg-surface-container-high text-on-surface-variant border border-outline-variant font-medium"
                      : "bg-critical-red/10 text-critical-red border border-critical-red/20 font-semibold";

                  const healthPipColor =
                    row.scraperHealth >= 98.0
                      ? "bg-success-green"
                      : row.scraperHealth >= 90.0
                      ? "bg-warning-amber"
                      : "bg-critical-red";

                  return (
                    <tr key={row.id} className="hover:bg-surface-pearl transition-colors group">
                      {/* Vendor name + Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded border border-hairline bg-canvas-white flex items-center justify-center p-1 shrink-0">
                            <span className="material-symbols-outlined text-primary text-[16px]">
                              {row.logoIcon || "storefront"}
                            </span>
                          </div>
                          <span className="font-body-strong font-semibold text-ink group-hover:text-primary transition-colors">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-on-surface-variant">{row.category}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase ${statusClass}`}>
                          {row.status}
                        </span>
                      </td>

                      {/* Pricing Plan */}
                      <td className="py-3.5 px-4 text-ink">{row.pricingPlan}</td>

                      {/* Recent Change link */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {row.recentChangeId ? (
                          <Link
                            to={`/intelligence/${row.recentChangeId}`}
                            className="text-sky-link hover:underline truncate block"
                          >
                            {row.recentChange}
                          </Link>
                        ) : (
                          <span className="text-secondary italic">{row.recentChange}</span>
                        )}
                      </td>

                      {/* Annual Impact */}
                      <td className={`py-3.5 px-4 font-body-strong font-semibold text-right ${impactColor}`}>
                        {row.annualImpact}
                      </td>

                      {/* Scraper Health */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${healthPipColor}`}></div>
                          <span className="font-data-tabular text-ink font-medium">
                            {row.scraperHealth === 0 ? "0%" : `${row.scraperHealth}%`}
                          </span>
                        </div>
                      </td>

                      {/* Last Verified */}
                      <td className="py-3.5 px-4 text-secondary text-right">{row.lastVerified}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-hairline p-sm bg-canvas-parchment flex items-center justify-between text-data-tabular text-[13px] shrink-0">
          <span className="text-secondary">
            Showing 1-{filteredVendors.length} of {filteredVendors.length} vendors
          </span>
          <div className="flex items-center gap-xs">
            <button
              className="p-1 rounded border border-hairline bg-canvas-white text-secondary hover:text-ink disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-sm align-middle">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded border border-primary bg-primary text-on-primary flex items-center justify-center font-semibold">
              1
            </button>
            <button
              className="p-1 rounded border border-hairline bg-canvas-white text-secondary hover:text-ink disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-sm align-middle">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
