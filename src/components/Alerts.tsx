import React, { useState } from "react";
import { mockAlerts } from "../mockData";
import type { AlertData } from "../mockData";

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>(mockAlerts);
  const [categoryFilter, setCategoryFilter] = useState<string>("Plan"); // Simulated filter
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  const handleSnooze = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSnoozed: !item.isSnoozed } : item))
    );
  };

  // Filter alerts (simulated search)
  const filteredAlerts = alerts.filter((item) => {
    // Search query filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    return true;
  });

  return (
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xxs mb-md text-[12px] text-secondary font-medium">
        <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
        <span className="material-symbols-outlined text-secondary text-[14px] select-none">chevron_right</span>
        <span className="text-ink">Alerts</span>
      </nav>

      {/* Page Header */}
      <div className="mb-lg md:mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-hairline pb-md">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-ink tracking-tight">Intelligence Feed</h2>
          <p className="font-body text-[14px] text-secondary mt-xs max-w-2xl">Monitor and respond to critical pricing changes, vendor risk signals, and structural market shifts.</p>
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <div className="bg-surface-pearl border border-hairline rounded-lg px-md py-2 flex items-center gap-md">
            <div className="flex flex-col">
              <span className="font-data-tabular text-[10px] text-secondary uppercase tracking-widest font-semibold">Active Risks</span>
              <span className="font-display-md text-[24px] font-bold text-ink leading-none mt-1">14</span>
            </div>
            <div className="w-px h-8 bg-hairline"></div>
            <div className="flex flex-col">
              <span className="font-data-tabular text-critical-red text-[10px] uppercase tracking-widest font-bold">Critical</span>
              <span className="font-display-md text-[24px] font-bold text-critical-red leading-none mt-1">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-grow items-stretch">

        {/* Main Feed (Canvas Stacking - 8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-md">
          {/* Filters Toolbar */}
          <div className="bg-canvas-white border border-hairline rounded-lg p-sm flex flex-wrap gap-sm items-center sticky top-0 z-20 shadow-sm">
            <span className="font-data-tabular text-[13px] text-secondary mr-xs">Filters:</span>
            <button className="bg-surface-pearl hover:bg-surface-container-high border border-hairline text-ink font-label-capsule text-[12px] px-sm py-1 rounded-full transition-colors flex items-center gap-xs">
              Severity <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
            </button>
            {categoryFilter && (
              <button
                onClick={() => setCategoryFilter("")}
                className="bg-primary text-on-primary border border-primary font-label-capsule text-[12px] px-sm py-1 rounded-full transition-colors flex items-center gap-xs"
              >
                Category: {categoryFilter} <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
            <button className="bg-surface-pearl hover:bg-surface-container-high border border-hairline text-ink font-label-capsule text-[12px] px-sm py-1 rounded-full transition-colors flex items-center gap-xs">
              Vendor <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
            </button>

            {/* Search Input inside toolbar */}
            <div className="relative ml-auto w-48 sm:w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[16px]">search</span>
              <input
                className="w-full bg-canvas-parchment focus:bg-white border border-hairline rounded-full py-1 pl-xl pr-sm text-data-tabular text-[12px] focus:outline-none"
                placeholder="Search feed..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Alert Cards */}
          {filteredAlerts.length === 0 ? (
            <div className="border border-hairline border-dashed rounded-lg p-section text-center bg-canvas-white shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 mb-md bg-surface-container-low rounded-full flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[36px]">notifications_off</span>
              </div>
              <h3 className="font-tagline text-[18px] text-ink font-semibold">No alerts matching filters</h3>
              <p className="font-body text-secondary text-[14px] mt-xs">Try clearing search terms or modifying severity categories.</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isCritical = item.severity === "critical";
              const isHigh = item.severity === "high";
              const leftBorderClass = isCritical ? "bg-critical-red" : isHigh ? "bg-warning-amber" : "bg-secondary";
              const titleClass = isCritical ? "text-critical-red" : isHigh ? "text-warning-amber" : "text-secondary";

              return (
                <article
                  key={item.id}
                  className={`bg-canvas-white border border-hairline rounded-lg p-md md:p-lg hover:border-outline-variant transition-colors group relative overflow-hidden shadow-sm ${item.isRead ? "opacity-60" : ""
                    }`}
                >
                  {/* Thick left severity bar */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${leftBorderClass}`}></div>

                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex items-center gap-sm">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${isCritical ? "bg-error-container text-on-error-container" : "bg-surface-container-highest"
                        }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCritical ? "warning" : isHigh ? "error" : "info"}
                        </span>
                      </span>
                      <span className={`font-data-tabular text-[12px] font-bold uppercase tracking-wider ${titleClass}`}>
                        {item.severity} Risk
                      </span>
                      <span className="text-secondary text-[12px]">•</span>
                      <span className="font-data-tabular text-[12px] text-secondary">{item.timeText}</span>
                      {item.isSnoozed && (
                        <span className="bg-surface-container-high text-secondary text-[10px] uppercase font-bold px-1 py-0.5 rounded">Snoozed</span>
                      )}
                    </div>
                    <button className="text-secondary hover:text-ink transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>

                  <div className="flex gap-md">
                    {/* Logo/Icon */}
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-hairline flex items-center justify-center shrink-0">
                      {item.vendorLogoUrl ? (
                        <img alt="Vendor Logo" className="w-6 h-6 object-contain rounded-full" src={item.vendorLogoUrl} />
                      ) : (
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          {isHigh ? "cloud" : "web"}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1">
                      <h3 className="font-body-strong text-[18px] text-ink leading-tight mb-xs font-semibold">{item.title}</h3>
                      <p className="font-body text-[14px] text-secondary mb-sm">{item.description}</p>

                      {/* Sub card metadata brief */}
                      {(item.impactAmount || item.actionByText) && (
                        <div className="bg-canvas-parchment border border-hairline rounded-md p-sm mb-md flex items-center justify-between">
                          {item.impactAmount && (
                            <div>
                              <div className="font-data-tabular text-[11px] text-secondary uppercase tracking-wider mb-xxs">Estimated Annual Impact</div>
                              <div className="font-body-strong text-critical-red font-semibold">{item.impactAmount}</div>
                            </div>
                          )}
                          {item.affectedWatchlist && (
                            <div className="hidden sm:block">
                              <div className="font-data-tabular text-[11px] text-secondary uppercase tracking-wider mb-xxs">Affected Watchlists</div>
                              <div className="font-body-strong text-[14px] text-ink font-semibold">{item.affectedWatchlist}</div>
                            </div>
                          )}
                          {item.actionByText && (
                            <div>
                              <div className="font-data-tabular text-[11px] text-secondary uppercase tracking-wider mb-xxs">Action Required By</div>
                              <div className="font-body-strong text-[14px] text-ink font-semibold">{item.actionByText}</div>
                            </div>
                          )}
                          {item.potentialImpactText && (
                            <div className="hidden sm:block">
                              <div className="font-data-tabular text-[11px] text-secondary uppercase tracking-wider mb-xxs">Potential Impact</div>
                              <div className="font-body-strong text-[14px] text-warning-amber font-semibold">{item.potentialImpactText}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-sm items-center">
                        <button
                          onClick={() => console.log("Mock review scenario")}
                          className="bg-primary text-on-primary font-label-capsule text-[12px] px-md py-1 rounded-full hover:scale-95 transition-transform duration-150 inline-block font-semibold"
                        >
                          Review Scenario
                        </button>
                        <button
                          onClick={() => console.log("Mock view scraper")}
                          className="bg-surface-pearl border border-hairline text-ink font-label-capsule text-[12px] px-md py-1 rounded-full hover:bg-surface-container-high transition-colors inline-block"
                        >
                          View Scraper
                        </button>

                        <div className="ml-auto flex gap-xs">
                          <button
                            onClick={() => handleRead(item.id)}
                            className={`p-1 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high ${item.isRead ? "text-primary bg-surface-container-low" : ""
                              }`}
                            title="Mark as Read"
                          >
                            <span className="material-symbols-outlined text-[18px] block">done</span>
                          </button>
                          <button
                            onClick={() => handleSnooze(item.id)}
                            className={`p-1 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high ${item.isSnoozed ? "text-primary bg-surface-container-low" : ""
                              }`}
                            title="Snooze"
                          >
                            <span className="material-symbols-outlined text-[18px] block">schedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Sidebar (Context & Settings - 4 or 3 cols) */}
        <aside className="hidden lg:flex flex-col lg:col-span-4 xl:col-span-3 gap-md">
          {/* Alert Fatigue Health Check */}
          <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
            <h4 className="font-body-strong text-ink mb-sm flex items-center gap-xs font-semibold text-[14px]">
              <span className="material-symbols-outlined text-[18px] text-secondary">monitoring</span>
              Alert Health
            </h4>
            <p className="font-data-tabular text-[12px] text-secondary mb-md">Daily notification volume vs. 30-day average.</p>

            {/* Mini Chart Placeholder (Simple CSS columns) */}
            <div className="flex items-end gap-[3px] h-20 mb-xs opacity-70 border-b border-hairline pb-1">
              <div className="w-full bg-surface-container-high rounded-t-sm h-[30%]"></div>
              <div className="w-full bg-surface-container-high rounded-t-sm h-[45%]"></div>
              <div className="w-full bg-surface-container-high rounded-t-sm h-[20%]"></div>
              <div className="w-full bg-surface-container-high rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-surface-container-high rounded-t-sm h-[55%]"></div>
              <div className="w-full bg-surface-container-high rounded-t-sm h-[80%] relative">
                <div className="absolute -top-1 left-0 w-full h-[2px] bg-warning-amber"></div>
              </div>
              <div className="w-full bg-primary/20 rounded-t-sm h-[95%] border-t-2 border-primary"></div>
            </div>

            <div className="flex justify-between font-data-tabular text-[10px] text-secondary">
              <span>Mon</span>
              <span>Today</span>
            </div>

            <div className="mt-md bg-error-container/30 border border-error-container rounded-md p-xs flex items-start gap-xs">
              <span className="material-symbols-outlined text-[14px] text-warning-amber shrink-0 mt-[2px]">trending_up</span>
              <span className="font-data-tabular text-[11px] text-ink leading-tight">Volume is <strong>24% higher</strong> than average today. Consider tuning your plan change sensitivity.</span>
            </div>
          </div>

          {/* Quick Preferences */}
          <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
            <h4 className="font-body-strong text-ink mb-sm font-semibold text-[14px]">Quick Preferences</h4>
            <ul className="flex flex-col gap-sm">
              <li className="flex items-center justify-between">
                <span className="font-data-tabular text-[13px] text-secondary font-medium">Critical Alerts (Email)</span>
                <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-data-tabular text-[13px] text-secondary font-medium">Digest (Weekly)</span>
                <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-data-tabular text-[13px] text-secondary font-medium">Scraper Warnings</span>
                <div className="w-8 h-4 bg-surface-container-highest rounded-full relative cursor-pointer">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </li>
            </ul>
            <button
              onClick={() => console.log("Mock manage settings click")}
              className="mt-md w-full bg-surface-pearl border border-hairline text-ink font-label-capsule text-[12px] py-1.5 rounded-full hover:bg-surface-container-high transition-colors inline-block text-center font-semibold"
            >
              Manage All Settings
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
};
