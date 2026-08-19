import React, { useState } from "react";
import { mockWatchlists } from "../mockData";

export const Watchlists: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all"); // "all" | "recent"
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [archivedOpen, setArchivedOpen] = useState<boolean>(false);

  // Handle Search & Tab filter
  const activeWatchlists = mockWatchlists.filter((item) => {
    if (item.archived) return false;
    
    // Search query filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;

    // Tab filter
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
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md border-b border-hairline pb-md">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-xxs text-[12px] text-secondary font-medium">
            <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
            <span className="material-symbols-outlined text-secondary text-[14px] select-none">chevron_right</span>
            <span className="text-ink">Watchlists</span>
          </nav>
          <h2 className="font-tagline text-[21px] text-ink font-bold tracking-tight mt-1">Watchlists</h2>
          <p className="font-body text-[14px] text-secondary mt-1">
            Monitor pricing changes across curated vendor groups.
          </p>
        </div>

        <div className="flex gap-sm shrink-0">
          <button className="hidden md:flex bg-primary text-on-primary font-body-strong text-[14px] py-2 px-md rounded-full items-center gap-xs hover:scale-95 transition-transform duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create Watchlist
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm mb-lg">
        {/* Navigation Tabs */}
        <nav className="flex gap-sm border-b border-hairline w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("all")}
            className={`py-2 px-sm text-[14px] font-body-strong transition-all ${
              activeTab === "all" 
                ? "text-primary border-b-2 border-primary font-semibold" 
                : "text-secondary hover:text-primary"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab("recent")}
            className={`py-2 px-sm text-[14px] font-body-strong transition-all ${
              activeTab === "recent" 
                ? "text-primary border-b-2 border-primary font-semibold" 
                : "text-secondary hover:text-primary"
            }`}
          >
            Recent
          </button>
        </nav>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
          <input 
            className="w-full pl-xl pr-md py-1.5 rounded-full border border-hairline bg-canvas-parchment/50 focus:bg-canvas-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body text-[13px]" 
            placeholder="Search watchlists..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Watchlists Bento Grid */}
      {activeWatchlists.length === 0 ? (
        /* Empty State */
        <div className="border border-hairline border-dashed rounded-lg p-section text-center bg-canvas-parchment/30 my-lg flex flex-col items-center">
          <div className="w-24 h-24 mb-lg opacity-50 flex items-center justify-center bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-[48px] text-secondary">visibility_off</span>
          </div>
          <h3 className="font-tagline text-[18px] text-ink mb-sm font-semibold">No watchlists found</h3>
          <p className="font-body text-[14px] text-secondary max-w-md mx-auto mb-lg">
            Start monitoring vendor pricing by grouping them into focused watchlists. Get alerted when critical changes occur.
          </p>
          <button className="bg-primary text-on-primary font-body-strong text-[13px] py-sm px-lg rounded-full inline-flex items-center gap-xs hover:scale-95 transition-transform duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create your first Watchlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter mb-xl">
          {activeWatchlists.map((watchlist) => {
            const isCritical = watchlist.healthPercentage < 90;
            return (
              <article key={watchlist.id} className="bg-canvas-white border border-hairline rounded-lg p-lg relative group flex flex-col shadow-sm hover:border-outline-variant transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h3 className="font-body-strong text-[17px] text-ink font-semibold mb-xxs">{watchlist.name}</h3>
                    <p className="font-data-tabular text-[13px] text-secondary">{watchlist.description}</p>
                  </div>
                  <button className="text-secondary hover:text-primary p-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-xs mb-lg">
                  <span className="inline-flex items-center px-sm py-0.5 rounded-full bg-surface-pearl border border-hairline font-label-capsule text-[12px] text-ink">
                    {watchlist.vendorCount} Vendors
                  </span>
                  <div className={`flex items-center gap-xxs px-sm py-0.5 rounded-full border font-label-capsule text-[12px] ${
                    isCritical 
                      ? "bg-warning-amber/10 border-warning-amber/30 text-warning-amber" 
                      : "bg-surface-pearl border-hairline text-ink"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isCritical ? "bg-warning-amber animate-pulse" : "bg-success-green"}`}></span>
                    {watchlist.healthPercentage}% Health
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-sm border-t border-hairline pt-md">
                  <div>
                    <p className="font-nav-link text-[11px] text-secondary uppercase tracking-widest mb-xxs">Recent Changes</p>
                    <p className="font-display-md text-[24px] font-bold text-ink">{watchlist.recentChanges}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-nav-link text-[11px] text-secondary uppercase tracking-widest mb-xxs">Est. Impact</p>
                    <p className={`font-display-md text-[24px] font-bold ${
                      watchlist.estimatedImpact.startsWith("+") 
                        ? "text-error" 
                        : watchlist.estimatedImpact.startsWith("-") 
                          ? "text-success-green" 
                          : "text-secondary"
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
        <div className="border-t border-hairline pt-lg mb-xxl">
          <button 
            onClick={() => setArchivedOpen(!archivedOpen)}
            className="flex items-center gap-sm text-secondary hover:text-ink transition-colors font-body-strong text-[14px] w-full text-left focus:outline-none"
          >
            <span className={`material-symbols-outlined transition-transform duration-200 ${archivedOpen ? "rotate-90" : ""}`}>
              chevron_right
            </span>
            Archived Watchlists ({archivedWatchlists.length})
          </button>
          
          {archivedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter mt-lg animate-fade-in">
              {archivedWatchlists.map((watchlist) => (
                <article key={watchlist.id} className="bg-canvas-white/60 border border-hairline rounded-lg p-lg relative group flex flex-col shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <h3 className="font-body-strong text-[17px] text-secondary font-semibold mb-xxs">{watchlist.name}</h3>
                      <p className="font-data-tabular text-[13px] text-secondary">{watchlist.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="inline-flex items-center px-sm py-0.5 rounded-full bg-surface-pearl border border-hairline font-label-capsule text-[12px] text-secondary">
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
