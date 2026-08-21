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
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] text-steel dark:text-slate font-dm-sans">
            <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-carbon dark:text-bone font-medium">Watchlists</span>
          </nav>
          <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight mt-1">Watchlists</h2>
          <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-1">
            Monitor pricing changes across curated vendor groups.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button className="hidden md:flex bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] py-2.5 px-6 rounded-full items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Watchlist
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <nav className="flex gap-3 border-b border-bone-light dark:border-white/10 w-full md:w-auto font-dm-sans">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-4 text-[14px] transition-colors ${activeTab === "all"
                ? "text-ink-black border-b-2 border-signal-blue dark:text-white dark:border-white font-medium"
                : "text-steel dark:text-ash hover:text-carbon dark:hover:text-white"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`py-2 px-4 text-[14px] transition-colors ${activeTab === "recent"
                ? "text-ink-black border-b-2 border-signal-blue dark:text-white dark:border-white font-medium"
                : "text-steel dark:text-ash hover:text-carbon dark:hover:text-white"
              }`}
          >
            Recent
          </button>
        </nav>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[18px]">search</span>
          <input
            className="w-full pl-9 pr-4 py-2 rounded-full border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all font-dm-sans text-[13px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate"
            placeholder="Search watchlists..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Watchlists Bento Grid */}
      {activeWatchlists.length === 0 ? (
        <div className="border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 text-center bg-vapor/30 dark:bg-white/[0.01] my-6 flex flex-col items-center">
          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-vapor dark:bg-white/5 rounded-full text-steel dark:text-slate border border-bone-light dark:border-white/10">
            <span className="material-symbols-outlined text-[48px]">visibility_off</span>
          </div>
          <h3 className="font-geist text-[18px] text-ink-black dark:text-bone mb-1 font-medium">No watchlists found</h3>
          <p className="font-dm-sans text-[14px] text-steel dark:text-ash max-w-md mx-auto mb-6">
            Start monitoring vendor pricing by grouping them into focused watchlists. Get alerted when critical changes occur.
          </p>
          <button className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[13px] py-2.5 px-6 rounded-full inline-flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create your first Watchlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {activeWatchlists.map((watchlist) => {
            const isCritical = watchlist.healthPercentage < 90;
            return (
              <article key={watchlist.id} className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 relative group flex flex-col shadow-sm dark:shadow-glass hover:border-signal-blue/30 dark:hover:border-white/25 transition-all duration-200 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-1">{watchlist.name}</h3>
                    <p className="font-dm-sans text-[13px] text-steel dark:text-ash">{watchlist.description}</p>
                  </div>
                  <button className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-6 font-dm-sans">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-[12px] text-carbon dark:text-bone font-medium">
                    {watchlist.vendorCount} Vendors
                  </span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-medium ${isCritical
                      ? "bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
                      : "bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isCritical ? "bg-amber-500 dark:bg-amber-400 animate-pulse" : "bg-emerald-500 dark:bg-emerald-400"}`}></span>
                    {watchlist.healthPercentage}% Health
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-bone-light dark:border-white/10 pt-4">
                  <div>
                    <p className="font-geist text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-1">Recent Changes</p>
                    <p className="font-geist text-[24px] font-medium text-ink-black dark:text-bone">{watchlist.recentChanges}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-geist text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-1">Est. Impact</p>
                    <p className={`font-geist text-[24px] font-medium ${watchlist.estimatedImpact.startsWith("+")
                        ? "text-red-600 dark:text-red-400"
                        : watchlist.estimatedImpact.startsWith("-")
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-steel dark:text-slate"
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
        <div className="border-t border-bone-light dark:border-white/10 pt-6 mb-8">
          <button
            onClick={() => setArchivedOpen(!archivedOpen)}
            className="flex items-center gap-2 text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors font-geist font-medium text-[14px] w-full text-left"
          >
            <span className={`material-symbols-outlined transition-transform duration-200 ${archivedOpen ? "rotate-90" : ""}`}>
              chevron_right
            </span>
            Archived Watchlists ({archivedWatchlists.length})
          </button>

          {archivedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              {archivedWatchlists.map((watchlist) => (
                <article key={watchlist.id} className="bg-white/50 dark:bg-[#161616]/40 border border-bone-light dark:border-white/10 rounded-[24px] p-6 relative group flex flex-col opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-geist text-[17px] text-ink-black dark:text-bone font-medium mb-1">{watchlist.name}</h3>
                      <p className="font-dm-sans text-[13px] text-steel dark:text-slate">{watchlist.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-dm-sans">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-[12px] text-steel dark:text-slate">
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



