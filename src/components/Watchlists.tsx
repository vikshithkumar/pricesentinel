import React, { useState } from "react";
import { mockWatchlists } from "../mockData";
import type { WatchlistData } from "../mockData";

const CUSTOM_WATCHLISTS_KEY = "pricesentinel_custom_watchlists";

const getStoredWatchlists = (): WatchlistData[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_WATCHLISTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse custom watchlists from localStorage", e);
  }
  return mockWatchlists;
};

const saveStoredWatchlists = (list: WatchlistData[]) => {
  try {
    localStorage.setItem(CUSTOM_WATCHLISTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save custom watchlists to localStorage", e);
  }
};

export const Watchlists: React.FC = () => {
  const [watchlists, setWatchlists] = useState<WatchlistData[]>(() => getStoredWatchlists());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [archivedOpen, setArchivedOpen] = useState<boolean>(false);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vendorCount, setVendorCount] = useState<number>(5);
  const [estimatedImpact, setEstimatedImpact] = useState<string>("$0");
  const [icon] = useState<string>("visibility");

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newWatchlist: WatchlistData = {
      id: "wl-" + Date.now(),
      name: name.trim(),
      description: description.trim() || "Curated vendor watch group",
      vendorCount: Number(vendorCount) || 1,
      healthPercentage: 100,
      recentChanges: 0,
      estimatedImpact: estimatedImpact.trim() || "$0",
      icon: icon || "visibility",
      archived: false,
    };

    const updated = [newWatchlist, ...watchlists];
    setWatchlists(updated);
    saveStoredWatchlists(updated);

    // Reset & Close
    setName("");
    setDescription("");
    setVendorCount(5);
    setEstimatedImpact("$0");
    setIsModalOpen(false);
  };

  const handleToggleArchive = (id: string) => {
    const updated = watchlists.map((w) =>
      w.id === id ? { ...w, archived: !w.archived } : w
    );
    setWatchlists(updated);
    saveStoredWatchlists(updated);
  };

  const activeWatchlists = watchlists.filter((item) => {
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

  const archivedWatchlists = watchlists.filter((item) => {
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] py-2.5 px-6 rounded-full items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
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
            All ({watchlists.filter((w) => !w.archived).length})
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`py-2 px-4 text-[14px] transition-colors ${activeTab === "recent"
                ? "text-ink-black border-b-2 border-signal-blue dark:text-white dark:border-white font-medium"
                : "text-steel dark:text-ash hover:text-carbon dark:hover:text-white"
              }`}
          >
            Recent Changes
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[13px] py-2.5 px-6 rounded-full inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create your first Watchlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {activeWatchlists.map((watchlist) => {
            const isCritical = watchlist.healthPercentage < 90;
            return (
              <article key={watchlist.id} className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 relative group flex flex-col shadow-sm dark:shadow-glass hover:border-signal-blue/30 dark:hover:border-white/25 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-1">{watchlist.name}</h3>
                    <p className="font-dm-sans text-[13px] text-steel dark:text-ash">{watchlist.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleArchive(watchlist.id)}
                    title="Archive Watchlist"
                    className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">archive</span>
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
            className="flex items-center gap-2 text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors font-geist font-medium text-[14px] w-full text-left cursor-pointer"
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
                    <button
                      onClick={() => handleToggleArchive(watchlist.id)}
                      title="Unarchive Watchlist"
                      className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white p-1 rounded-full cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">unarchive</span>
                    </button>
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

      {/* Create Watchlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161616] border border-bone-light dark:border-white/10 rounded-[24px] p-6 w-full max-w-md shadow-2xl space-y-5 text-carbon dark:text-bone font-dm-sans">
            <div className="flex justify-between items-center border-b border-bone-light dark:border-white/10 pb-4">
              <h3 className="font-geist text-[20px] font-medium text-ink-black dark:text-bone flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-signal-blue dark:text-white">visibility</span>
                Create New Watchlist
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateWatchlist} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Watchlist Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Core Infrastructure"
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Critical vendors monitored for price spikes"
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                    Vendor Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={vendorCount}
                    onChange={(e) => setVendorCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                    Est. Annual Impact
                  </label>
                  <input
                    type="text"
                    value={estimatedImpact}
                    onChange={(e) => setEstimatedImpact(e.target.value)}
                    placeholder="e.g. +$45k"
                    className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone rounded-full font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-2.5 px-4 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black font-medium text-[13px] rounded-full dark:hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Create Watchlist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};



