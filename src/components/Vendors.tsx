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
    <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-[#fcfcfc] w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center space-x-2 font-inter text-xs text-[#6b7280]">
          <li>
            <Link to="/" className="hover:text-[#145aff] transition-colors">Dashboard</Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </li>
          <li className="font-medium text-[#020520]" aria-current="page">
            Vendors
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] font-semibold text-[#020520] tracking-[-1.48px] leading-tight">
            Vendor Portfolio
          </h2>
          <p className="font-mono text-[14px] text-[#374151] mt-1">
            Total Vendors: 542
          </p>
        </div>
        <button
          onClick={() => alert("Add Vendor flow initiated.")}
          className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] font-inter font-medium text-[14px] rounded-full py-2 px-6 transition-colors duration-150 flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        {/* Search Input */}
        <div className="relative w-full lg:w-96 shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors, categories, plans..."
            className="w-full pl-9 pr-4 py-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] font-inter text-[13px] text-[#020520] placeholder:text-[#6b7280] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full overflow-x-auto text-[13px] font-inter">
          <span className="text-[#374151] font-medium mr-1">Categories:</span>
          {["AI Infrastructure", "CRM", "DevTools"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1 rounded-full border transition-colors duration-150 ${
                selectedCategory === cat
                  ? "bg-[#f0f4fe] border-[#145aff] text-[#145aff] font-medium"
                  : "bg-[#ffffff] border-[#e2e8f0] text-[#374151] hover:bg-[#f0f4fe]/60"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-[#e2e8f0] mx-1 hidden sm:block"></div>

          {/* Health Pill */}
          <button
            onClick={() => setSelectedHealth(selectedHealth === "Live" ? null : "Live")}
            className={`px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1.5 ${
              selectedHealth === "Live"
                ? "bg-[#16ca2e]/10 border-[#16ca2e] text-[#16ca2e] font-medium"
                : "bg-[#ffffff] border-[#e2e8f0] text-[#374151] hover:bg-[#f0f4fe]/60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#16ca2e]"></span>
            <span>Live Health</span>
          </button>
        </div>
      </div>

      {/* Main Vendor Data Table */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        {filteredVendors.length === 0 ? (
          <div className="border border-[#e2e8f0] border-dashed rounded-[16px] p-10 text-center bg-[#ffffff] my-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#6b7280]">
              <span className="material-symbols-outlined text-[36px]">storefront_off</span>
            </div>
            <h3 className="font-inter text-[18px] text-[#020520] font-semibold">No vendors found</h3>
            <p className="font-inter text-[#6b7280] text-[14px] mt-1 max-w-sm">
              Try adjusting your search query or removing category filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] font-inter text-[#374151] text-[12px] font-medium uppercase tracking-wider">
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pricing Plan</th>
                  <th className="py-3 px-4">Recent Changes</th>
                  <th className="py-3 px-4 text-right">Annual Impact</th>
                  <th className="py-3 px-4 text-center">Scraper Health</th>
                  <th className="py-3 px-4 text-right">Last Verified</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px] text-[#14141e] divide-y divide-[#e2e8f0]">
                {filteredVendors.map((row) => {
                  const isIncrease = row.impactType === "increase";
                  const isDecrease = row.impactType === "decrease";

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-[#f0f4fe]/60 transition-colors duration-150 group cursor-pointer"
                      onClick={() => row.recentChangeId ? navigate(`/intelligence/${row.recentChangeId}`) : navigate("/intelligence")}
                    >
                      <td className="py-3.5 px-4 font-inter">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#145aff] font-bold text-[13px] shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-[#020520] group-hover:text-[#145aff] transition-colors text-[14px]">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-inter text-[#374151]">
                        {row.category}
                      </td>

                      <td className="py-3.5 px-4 font-inter">
                        <span className="inline-flex items-center gap-1.5 bg-[#145aff]/10 text-[#145aff] px-3 py-0.5 rounded-full text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#145aff]"></span>
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-inter font-medium text-[#020520]">
                        {row.pricingPlan}
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px] truncate font-inter">
                        {row.recentChangeId ? (
                          <Link
                            to={`/intelligence/${row.recentChangeId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#145aff] hover:underline font-medium"
                          >
                            {row.recentChange}
                          </Link>
                        ) : (
                          <span className="text-[#6b7280] italic">{row.recentChange}</span>
                        )}
                      </td>

                      <td className={`py-3.5 px-4 text-right font-semibold text-[14px] ${
                        isIncrease ? "text-[#f26052]" : isDecrease ? "text-[#16ca2e]" : "text-[#6b7280]"
                      }`}>
                        {row.annualImpact}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#16ca2e]"></span>
                          <span className="font-semibold text-[#020520]">{row.scraperHealth}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right text-[#6b7280] text-[12px]">
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

