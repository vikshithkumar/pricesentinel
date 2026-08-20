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
    <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-[#fcfcfc] w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center space-x-2 font-inter text-xs text-[#6b7280]">
          <li>
            <Link to="/" className="text-[#145aff] hover:underline font-medium">Dashboard</Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </li>
          <li className="text-[#020520] font-medium" aria-current="page">
            Intelligence Feed
          </li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight mb-1">
            Intelligence Feed
          </h2>
          <p className="font-inter text-[14px] text-[#374151]">
            Real-time detection of pricing, plan, and feature shifts across tracked vendors.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => alert("Exporting Intelligence Feed CSV...")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fcfcfc] border border-[#e2e8f0] rounded-full font-inter text-[13px] text-[#020520] hover:bg-[#f0f4fe] transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>View Settings</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <span className="font-inter text-[13px] text-[#6b7280] mr-1 flex items-center">
            <span className="material-symbols-outlined text-[16px] mr-1">filter_list</span>
            Filters:
          </span>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Intelligence..."
              className="w-full pl-9 pr-3 py-1.5 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] focus:bg-[#ffffff] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] font-inter text-[13px] transition-all"
            />
          </div>

          {/* Quick Filter Pill */}
          <button
            onClick={() => setSelectedCategory(selectedCategory ? null : "Plan Restructure")}
            className={`px-3 py-1 rounded-full border font-inter text-[13px] flex items-center transition-colors duration-150 ${
              selectedCategory === "Plan Restructure"
                ? "border-[#145aff] bg-[#f0f4fe] text-[#145aff] font-medium"
                : "border-[#e2e8f0] bg-[#ffffff] text-[#020520] hover:bg-[#f0f4fe]/60"
            }`}
          >
            Category: Plan Shifts
            {selectedCategory === "Plan Restructure" && (
              <span className="material-symbols-outlined text-[14px] ml-1">close</span>
            )}
          </button>
        </div>

        <div className="w-full md:w-auto flex items-center space-x-2 border-t md:border-t-0 border-[#e2e8f0] pt-2 md:pt-0">
          <span className="font-mono text-[#6b7280] text-[12px]">
            Showing {filteredDetections.length} detected events
          </span>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        {filteredDetections.length === 0 ? (
          <div className="border border-[#e2e8f0] border-dashed rounded-[16px] p-10 text-center bg-[#ffffff] my-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#6b7280]">
              <span className="material-symbols-outlined text-[36px]">search_off</span>
            </div>
            <h3 className="font-inter text-[18px] text-[#020520] font-semibold">No changes found</h3>
            <p className="font-inter text-[#6b7280] text-[14px] mt-1 max-w-sm">
              No pricing detections match your filter criteria. Try clearing search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse font-mono text-[13px]">
              <thead>
                <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] font-inter text-[#374151] text-[12px] font-medium uppercase tracking-wider">
                  <th className="p-4 font-medium">Vendor</th>
                  <th className="p-4 font-medium">Change Type</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Date Detected</th>
                  <th className="p-4 font-medium text-right">Est. Impact</th>
                  <th className="p-4 font-medium">Diff / Details</th>
                  <th className="p-4 font-medium w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-[#14141e]">
                {filteredDetections.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/intelligence/${row.id}`)}
                    className="hover:bg-[#f0f4fe]/60 transition-colors duration-150 group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0 text-[#145aff]">
                          <span className="material-symbols-outlined text-[16px]">{row.icon}</span>
                        </div>
                        <div>
                          <span className="font-inter font-semibold block text-[14px] text-[#020520] group-hover:text-[#145aff] transition-colors">
                            {row.vendor}
                          </span>
                          <span className="font-inter text-[#6b7280] text-[11px] flex items-center mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16ca2e] mr-1.5"></span>
                            Scraper Active
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-inter">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        row.changeType === "Price Increase" || row.changeType === "Fee Added"
                          ? "bg-[#f26052]/10 text-[#f26052]"
                          : row.changeType === "Price Decrease"
                            ? "bg-[#16ca2e]/10 text-[#16ca2e]"
                            : "bg-[#ffa64d]/10 text-[#ffa64d]"
                      }`}>
                        {row.changeType}
                      </span>
                    </td>

                    <td className="p-4 hidden sm:table-cell text-[#6b7280]">
                      Today, 09:41 AM
                    </td>

                    <td className="p-4 text-right font-semibold text-[#f26052]">
                      {row.impact}
                    </td>

                    <td className="p-4">
                      <div className="bg-[#f1f5f9] rounded-[8px] px-2.5 py-1 border border-[#e2e8f0] font-mono text-[12px] inline-block">
                        <span className="text-[#6b7280] line-through mr-2">$19.00/mo</span>
                        <span className="material-symbols-outlined text-[10px] text-[#6b7280] align-middle">arrow_forward</span>
                        <span className="text-[#f26052] font-semibold ml-2">{row.values}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center font-inter">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/intelligence/${row.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] transition-colors duration-150 text-[11px] font-medium"
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

