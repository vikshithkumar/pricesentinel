import React, { useState } from "react";
import { mockWatchlists } from "../mockData";

export const Watchlists: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [archivedOpen, setArchivedOpen] = useState<boolean>(false);

  const activeWatchlists = mockWatchlists.filter((item) => {
    if (item.archived) return false;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "recent") {
      return item.recentChanges > 0;
    }
    return true;
  });

  const archivedWatchlists = mockWatchlists.filter((item) => {
    if (!item.archived) return false;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#6b7280] font-inter">
            <span className="hover:text-[#145aff] cursor-pointer transition-colors">Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#020520] font-medium">Watchlists</span>
          </nav>
          <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight mt-1">Watchlists</h2>
          <p className="font-inter text-[14px] text-[#374151] mt-1">
            Monitor pricing changes across curated vendor groups.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="hidden md:flex bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[14px] py-2 px-6 rounded-full items-center gap-1.5 hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Watchlist
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <nav className="flex gap-2 border-b border-[#e2e8f0] w-full md:w-auto font-inter">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-3 text-[14px] transition-colors duration-150 ${activeTab === "all"
                ? "text-[#145aff] border-b-2 border-[#145aff] font-semibold"
                : "text-[#374151] hover:text-[#145aff]"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`py-2 px-3 text-[14px] transition-colors duration-150 ${activeTab === "recent"
                ? "text-[#145aff] border-b-2 border-[#145aff] font-semibold"
                : "text-[#374151] hover:text-[#145aff]"
              }`}
          >
            Recent
          </button>
        </nav>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px]">search</span>
          <input
            className="w-full pl-9 pr-4 py-1.5 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] focus:bg-[#ffffff] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all font-inter text-[13px] text-[#020520]"
            placeholder="Search watchlists..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Watchlists Bento Grid */}
      {activeWatchlists.length === 0 ? (
        <div className="border border-[#e2e8f0] border-dashed rounded-[16px] p-10 text-center bg-[#ffffff] my-6 flex flex-col items-center">
          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-[#f1f5f9] rounded-full text-[#6b7280]">
            <span className="material-symbols-outlined text-[48px]">visibility_off</span>
          </div>
          <h3 className="font-inter text-[18px] text-[#020520] mb-1 font-semibold">No watchlists found</h3>
          <p className="font-inter text-[14px] text-[#6b7280] max-w-md mx-auto mb-6">
            Start monitoring vendor pricing by grouping them into focused watchlists. Get alerted when critical changes occur.
          </p>
          <button className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[13px] py-2 px-6 rounded-full inline-flex items-center gap-1.5 hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create your first Watchlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {activeWatchlists.map((watchlist) => {
            const isCritical = watchlist.healthPercentage < 90;
            return (
              <article key={watchlist.id} className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 relative group flex flex-col shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] hover:border-[#145aff]/40 transition-colors duration-150 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-inter text-[17px] text-[#020520] font-semibold mb-1">{watchlist.name}</h3>
                    <p className="font-inter text-[13px] text-[#374151]">{watchlist.description}</p>
                  </div>
                  <button className="text-[#6b7280] hover:text-[#145aff] p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-6 font-inter">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-[12px] text-[#374151] font-medium">
                    {watchlist.vendorCount} Vendors
                  </span>
                  <div className={`flex items-center gap-1 px-3 py-0.5 rounded-full border text-[12px] font-medium ${isCritical
                      ? "bg-[#ffa64d]/10 border-[#ffa64d]/30 text-[#ffa64d]"
                      : "bg-[#16ca2e]/10 border-[#16ca2e]/30 text-[#16ca2e]"
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isCritical ? "bg-[#ffa64d] animate-pulse" : "bg-[#16ca2e]"}`}></span>
                    {watchlist.healthPercentage}% Health
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-[#e2e8f0] pt-4">
                  <div>
                    <p className="font-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Recent Changes</p>
                    <p className="font-mono text-[24px] font-semibold text-[#020520]">{watchlist.recentChanges}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Est. Impact</p>
                    <p className={`font-mono text-[24px] font-semibold ${watchlist.estimatedImpact.startsWith("+")
                        ? "text-[#f26052]"
                        : watchlist.estimatedImpact.startsWith("-")
                          ? "text-[#16ca2e]"
                          : "text-[#6b7280]"
                      }`}>
                      {watchlist.estimatedImpact}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Archived Section Accordion */}
      {archivedWatchlists.length > 0 && (
        <div className="border-t border-[#e2e8f0] pt-6 mb-8">
          <button
            onClick={() => setArchivedOpen(!archivedOpen)}
            className="flex items-center gap-2 text-[#6b7280] hover:text-[#020520] transition-colors font-inter font-semibold text-[14px] w-full text-left"
          >
            <span className={`material-symbols-outlined transition-transform duration-200 ${archivedOpen ? "rotate-90" : ""}`}>
              chevron_right
            </span>
            Archived Watchlists ({archivedWatchlists.length})
          </button>

          {archivedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              {archivedWatchlists.map((watchlist) => (
                <article key={watchlist.id} className="bg-[#ffffff]/60 border border-[#e2e8f0] rounded-[16px] p-6 relative group flex flex-col opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-inter text-[17px] text-[#374151] font-semibold mb-1">{watchlist.name}</h3>
                      <p className="font-inter text-[13px] text-[#6b7280]">{watchlist.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-inter">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] text-[12px] text-[#6b7280]">
                      {watchlist.vendorCount} Vendors (Archived)
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

