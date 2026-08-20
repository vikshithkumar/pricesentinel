import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vendors } from "../mockData";

export const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<"Live" | "Degraded" | null>(null);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pricingPlan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory ? v.category === selectedCategory : true;

      let matchesHealth = true;
      if (selectedHealth === "Live") {
        matchesHealth = v.scraperHealth >= 96.0 && v.status !== "Offline";
      } else if (selectedHealth === "Degraded") {
        matchesHealth = v.scraperHealth < 96.0 || v.status === "Offline";
      }

      return matchesSearch && matchesCategory && matchesHealth;
    });
  }, [searchTerm, selectedCategory, selectedHealth]);

  return (
    <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-lg bg-background">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-xs">
        <ol className="flex items-center space-x-2 font-body text-sm">
          <li>
            <Link to="/" className="text-secondary hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="text-secondary">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </li>
          <li className="font-body-strong text-ink" aria-current="page">
            Vendors
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md border-b border-hairline pb-lg">
        <div>
          <h2 className="font-display-lg text-display-lg font-bold text-ink tracking-tight">
            Vendor Portfolio
          </h2>
          <p className="font-body text-body text-secondary mt-xs">
            Total Vendors: 542
          </p>
        </div>
        <button
          onClick={() => alert("Add Vendor flow initiated.")}
          className="bg-primary text-on-primary font-body-strong text-body-strong rounded-full py-2 px-md hover:bg-primary-container active:scale-[0.98] transition-all duration-150 flex items-center gap-xs self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-surface-pearl border border-hairline rounded-lg p-sm flex flex-col lg:flex-row gap-sm items-start lg:items-center justify-between shadow-sm">
        {/* Search Input */}
        <div className="relative w-full lg:w-96 shrink-0">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors, categories, plans..."
            className="w-full pl-10 pr-md py-1.5 bg-canvas-white border border-hairline rounded-md font-body text-body text-ink placeholder:text-secondary focus:outline-none focus:border-primary transition-colors text-[13px]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-sm w-full overflow-x-auto text-[13px] font-label-capsule">
          <span className="text-secondary font-medium mr-xs">Categories:</span>
          {["AI Infrastructure", "CRM", "DevTools"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-sm py-1 rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-primary-container/20 border-primary text-primary font-semibold"
                  : "bg-canvas-white border-hairline text-ink hover:bg-surface-container-low"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-hairline mx-1 hidden sm:block"></div>

          {/* Health Pill */}
          <button
            onClick={() => setSelectedHealth(selectedHealth === "Live" ? null : "Live")}
            className={`px-sm py-1 rounded-full border transition-all flex items-center gap-1 ${
              selectedHealth === "Live"
                ? "bg-success-green/10 border-success-green/30 text-success-green font-semibold"
                : "bg-canvas-white border-hairline text-ink hover:bg-surface-container-low"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-success-green"></span>
            <span>Live Health</span>
          </button>
        </div>
      </div>

      {/* Main Vendor Data Table */}
      <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
        {filteredVendors.length === 0 ? (
          <div className="border border-hairline border-dashed rounded-lg p-section text-center bg-canvas-parchment/30 my-lg flex flex-col items-center">
            <div className="w-16 h-16 mb-md bg-surface-container-low rounded-full flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">storefront_off</span>
            </div>
            <h3 className="font-tagline text-[18px] text-ink font-semibold">No vendors found</h3>
            <p className="font-body text-secondary text-[14px] mt-xs max-w-sm">
              Try adjusting your search query or removing category filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-canvas-parchment border-b border-hairline font-label-capsule text-secondary text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-md font-medium">Vendor</th>
                  <th className="py-3 px-md font-medium">Category</th>
                  <th className="py-3 px-md font-medium">Status</th>
                  <th className="py-3 px-md font-medium">Pricing Plan</th>
                  <th className="py-3 px-md font-medium">Recent Changes</th>
                  <th className="py-3 px-md font-medium text-right">Annual Impact</th>
                  <th className="py-3 px-md font-medium text-center">Scraper Health</th>
                  <th className="py-3 px-md font-medium text-right">Last Verified</th>
                </tr>
              </thead>
              <tbody className="font-data-tabular text-[13px] text-ink divide-y divide-hairline">
                {filteredVendors.map((row) => {
                  const isIncrease = row.impactType === "increase";
                  const isDecrease = row.impactType === "decrease";

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-surface-pearl transition-colors group cursor-pointer"
                      onClick={() => row.recentChangeId ? navigate(`/intelligence/${row.recentChangeId}`) : navigate("/intelligence")}
                    >
                      <td className="py-3 px-md">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-surface-container-low border border-hairline flex items-center justify-center text-primary font-bold text-[12px] shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="font-body-strong text-ink group-hover:text-primary transition-colors text-[14px]">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-md text-secondary">
                        {row.category}
                      </td>

                      <td className="py-3 px-md">
                        <span className="inline-flex items-center gap-1 border border-primary/20 bg-primary-container/10 text-primary px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3 px-md font-medium">
                        {row.pricingPlan}
                      </td>

                      <td className="py-3 px-md max-w-[200px] truncate">
                        {row.recentChangeId ? (
                          <Link
                            to={`/intelligence/${row.recentChangeId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:underline font-medium"
                          >
                            {row.recentChange}
                          </Link>
                        ) : (
                          <span className="text-secondary italic">{row.recentChange}</span>
                        )}
                      </td>

                      <td className={`py-3 px-md text-right font-body-strong text-[14px] ${
                        isIncrease ? "text-critical-red" : isDecrease ? "text-success-green" : "text-secondary"
                      }`}>
                        {row.annualImpact}
                      </td>

                      <td className="py-3 px-md text-center">
                        <div className="flex items-center justify-center gap-1 font-data-tabular">
                          <span className="w-2 h-2 rounded-full bg-success-green"></span>
                          <span className="font-semibold text-ink">{row.scraperHealth}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-md text-right text-secondary text-[12px]">
                        {row.lastVerified}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};
