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

  const handleExportCsv = () => {
    const headers = ["ID", "Vendor", "Change Type", "Impact", "Values", "Severity", "Confidence"];
    const rows = filteredDetections.map((row) => [
      `"${row.id.replace(/"/g, '""')}"`,
      `"${row.vendor.replace(/"/g, '""')}"`,
      `"${row.changeType.replace(/"/g, '""')}"`,
      `"${row.impact.replace(/"/g, '""')}"`,
      `"${row.values.replace(/"/g, '""')}"`,
      `"${row.severity.replace(/"/g, '""')}"`,
      `"${row.confidence.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "intelligence_feed.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-frost dark:bg-[#0a0a0a] w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-1">
        <ol className="flex items-center space-x-2 font-dm-sans text-xs text-steel dark:text-slate">
          <li>
            <Link to="/" className="text-carbon dark:text-bone hover:underline font-medium">Dashboard</Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li className="text-carbon dark:text-bone font-medium" aria-current="page">
            Intelligence Feed
          </li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight mb-1">
            Intelligence Feed
          </h2>
          <p className="font-dm-sans text-[14px] text-steel dark:text-ash">
            Real-time detection of pricing, plan, and feature shifts across tracked vendors.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-5 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-full font-dm-sans text-[13px] text-carbon dark:text-bone hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-glass">
        <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
          <span className="font-dm-sans text-[13px] text-steel dark:text-ash mr-1 flex items-center">
            <span className="material-symbols-outlined text-[16px] mr-1.5">filter_list</span>
            Filters:
          </span>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Intelligence..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 focus:outline-none focus:border-signal-blue dark:focus:border-white/30 font-dm-sans text-[13px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate transition-all"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="appearance-none pl-4 pr-8 py-1.5 rounded-full border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 text-carbon dark:text-bone font-dm-sans text-[13px] focus:outline-none focus:border-signal-blue dark:focus:border-white/30 cursor-pointer transition-all"
            >
              <option value="" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Category: All</option>
              <option value="Plan Restructure" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Category: Plan Shifts</option>
              <option value="Price Increase" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Category: Price Increase</option>
              <option value="Price Drop" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Category: Price Drop</option>
              <option value="T&C Update" className="bg-white dark:bg-[#161616] text-carbon dark:text-bone">Category: T&C Update</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center space-x-2 border-t md:border-t-0 border-bone-light dark:border-white/10 pt-2 md:pt-0">
          <span className="font-geist text-steel dark:text-slate text-[12px]">
            Showing {filteredDetections.length} detected events
          </span>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm dark:shadow-glass">
        {filteredDetections.length === 0 ? (
          <div className="border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 text-center bg-vapor/30 dark:bg-white/[0.01] my-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-vapor dark:bg-white/5 rounded-full flex items-center justify-center text-steel dark:text-slate border border-bone-light dark:border-white/10">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">No changes found</h3>
            <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1 max-w-sm">
              No pricing detections match your filter criteria. Try clearing search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse font-dm-sans text-[13px]">
              <thead>
                <tr className="bg-vapor dark:bg-white/[0.02] border-b border-bone-light dark:border-white/10 font-dm-sans text-steel dark:text-ash text-[12px] font-medium uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Vendor</th>
                  <th className="py-4 px-6 font-medium">Change Type</th>
                  <th className="py-4 px-6 font-medium hidden sm:table-cell">Date Detected</th>
                  <th className="py-4 px-6 font-medium text-right">Est. Impact</th>
                  <th className="py-4 px-6 font-medium">Diff / Details</th>
                  <th className="py-4 px-6 font-medium w-16 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone-light/60 dark:divide-white/5 text-carbon dark:text-bone">
                {filteredDetections.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/intelligence/${row.id}`)}
                    className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors duration-150 group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center shrink-0 text-carbon dark:text-bone group-hover:bg-[#e4e4e7] dark:group-hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">{row.icon}</span>
                        </div>
                        <div>
                          <span className="font-geist font-medium block text-[14px] text-ink-black dark:text-bone group-hover:text-signal-blue dark:group-hover:text-white transition-colors">
                            {row.vendor}
                          </span>
                          <span className="font-dm-sans text-steel dark:text-ash text-[11px] flex items-center mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5"></span>
                            Scraper Active
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-dm-sans">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border ${
                        row.changeType === "Price Increase" || row.changeType === "Fee Added"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                          : row.changeType === "Price Decrease"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                      }`}>
                        {row.changeType}
                      </span>
                    </td>

                    <td className="py-4 px-6 hidden sm:table-cell text-steel dark:text-slate font-geist">
                      Today, 09:41 AM
                    </td>

                    <td className="py-4 px-6 text-right font-geist font-medium text-red-600 dark:text-red-400">
                      {row.impact}
                    </td>

                    <td className="py-4 px-6">
                      <div className="bg-vapor dark:bg-white/5 rounded-[6px] px-3 py-1 border border-bone-light dark:border-white/10 font-geist text-[12px] inline-block">
                        <span className="text-steel dark:text-slate line-through mr-2">$19.00/mo</span>
                        <span className="material-symbols-outlined text-[10px] text-steel dark:text-slate align-middle">arrow_forward</span>
                        <span className="text-red-600 dark:text-red-400 font-medium ml-2">{row.values}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center font-dm-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/intelligence/${row.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-full border border-bone-light dark:border-white/15 text-carbon dark:text-bone hover:bg-vapor dark:hover:bg-white/10 transition-colors duration-150 text-[11px] font-medium"
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



