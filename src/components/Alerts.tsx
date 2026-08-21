import React, { useState, useEffect } from "react";
import { mockAlerts } from "../mockData";
import type { AlertData } from "../mockData";
import { api } from "../services/api";
import type { AlertResponse } from "../services/api";

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>(mockAlerts);
  const [categoryFilter, setCategoryFilter] = useState<string>("Plan");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getAlerts()
      .then((apiAlerts: AlertResponse[]) => {
        if (isMounted && apiAlerts && apiAlerts.length > 0) {
          const mapped: AlertData[] = apiAlerts.map((a) => ({
            id: a.changeEventId,
            severity: (a.finalScore >= 75 ? "critical" : a.finalScore >= 45 ? "high" : "info") as 'critical' | 'high' | 'info',
            title: `${a.vendorName}: ${a.type.replace(/_/g, " ")}`,
            description: a.impactSummary || "Detected pricing change in monitoring scan.",
            timeText: new Date(a.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            vendorName: a.vendorName,
            vendorLogoUrl: "",
            isRead: a.status === "DISMISSED",
            isSnoozed: false,
            impactAmount: a.impactSummary,
          }));
          setAlerts(mapped);
        }
      })
      .catch((err) => {
        console.warn("Backend alerts API unavailable, using seed alert feed", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRead = async (id: string) => {
    setDismissingId(id);
    try {
      await api.dismissAlert(id);
      setAlerts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.warn("Alert dismiss fallback to local state", err);
      setAlerts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
      );
    } finally {
      setDismissingId(null);
    }
  };

  const handleSnooze = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSnoozed: !item.isSnoozed } : item))
    );
  };

  const filteredAlerts = alerts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    return true;
  });

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3 text-[12px] text-steel dark:text-slate font-dm-sans">
        <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors">Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-carbon dark:text-bone font-medium">Alerts</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">Intelligence Feed</h2>
          <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-1 max-w-2xl">Monitor and respond to critical pricing changes, vendor risk signals, and structural market shifts.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[20px] px-5 py-2.5 flex items-center gap-5 shadow-sm dark:shadow-glass">
            <div className="flex flex-col">
              <span className="font-geist text-[10px] text-steel dark:text-slate uppercase tracking-wider font-medium">Active Risks</span>
              <span className="font-geist text-[24px] font-medium text-ink-black dark:text-bone leading-none mt-1">{alerts.length}</span>
            </div>
            <div className="w-px h-8 bg-bone-light dark:bg-white/10"></div>
            <div className="flex flex-col">
              <span className="font-geist text-red-600 dark:text-red-400 text-[10px] uppercase tracking-wider font-medium">Critical</span>
              <span className="font-geist text-[24px] font-medium text-red-600 dark:text-red-400 leading-none mt-1">
                {alerts.filter(a => a.severity === 'critical').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch">

        {/* Main Feed */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
          {/* Filters Toolbar */}
          <div className="bg-white/80 dark:bg-[#161616]/80 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-3.5 flex flex-wrap gap-3 items-center sticky top-0 z-20 shadow-sm dark:shadow-glass font-dm-sans">
            <span className="font-geist text-[13px] text-steel dark:text-slate mr-1">Filters:</span>
            <button className="bg-vapor dark:bg-white/5 hover:bg-[#e4e4e7] dark:hover:bg-white/10 border border-bone-light dark:border-white/10 text-carbon dark:text-bone text-[12px] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
              Severity <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate">expand_more</span>
            </button>
            {categoryFilter && (
              <button
                onClick={() => setCategoryFilter("")}
                className="bg-signal-blue/15 border border-signal-blue/30 text-signal-blue dark:bg-white/15 dark:border-white/20 dark:text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Category: {categoryFilter} <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
            <button className="bg-vapor dark:bg-white/5 hover:bg-[#e4e4e7] dark:hover:bg-white/10 border border-bone-light dark:border-white/10 text-carbon dark:text-bone text-[12px] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
              Vendor <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate">expand_more</span>
            </button>

            {/* Search Input */}
            <div className="relative ml-auto w-48 sm:w-64">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[16px]">search</span>
              <input
                className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-full py-1.5 pl-9 pr-4 font-dm-sans text-[12px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate focus:outline-none focus:border-signal-blue dark:focus:border-white/30"
                placeholder="Search feed..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Alert Cards */}
          {filteredAlerts.length === 0 ? (
            <div className="border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 text-center bg-vapor/30 dark:bg-white/[0.01] shadow-sm dark:shadow-glass flex flex-col items-center">
              <div className="w-16 h-16 mb-4 bg-vapor dark:bg-white/5 rounded-full flex items-center justify-center text-steel dark:text-slate border border-bone-light dark:border-white/10">
                <span className="material-symbols-outlined text-[36px]">notifications_off</span>
              </div>
              <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">No alerts matching filters</h3>
              <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1">Try clearing search terms or modifying severity categories.</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isCritical = item.severity === "critical";
              const isHigh = item.severity === "high";
              const leftBorderClass = isCritical ? "bg-red-500" : isHigh ? "bg-amber-500" : "bg-signal-blue";
              const titleClass = isCritical ? "text-red-600 dark:text-red-400" : isHigh ? "text-amber-600 dark:text-amber-400" : "text-signal-blue dark:text-blue-400";

              return (
                <article
                  key={item.id}
                  className={`bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 md:p-6 hover:border-signal-blue/30 dark:hover:border-white/25 transition-all duration-200 group relative overflow-hidden shadow-sm dark:shadow-glass ${item.isRead ? "opacity-50" : ""
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${leftBorderClass}`}></div>

                  <div className="flex justify-between items-start mb-3 font-dm-sans">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${isCritical ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-vapor dark:bg-white/5 text-steel dark:text-slate"
                        }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCritical ? "warning" : isHigh ? "error" : "info"}
                        </span>
                      </span>
                      <span className={`font-geist text-[12px] font-medium uppercase tracking-wider ${titleClass}`}>
                        {item.severity} Risk
                      </span>
                      <span className="text-steel dark:text-slate text-[12px]">•</span>
                      <span className="font-geist text-[12px] text-steel dark:text-slate">{item.timeText}</span>
                      {item.isSnoozed && (
                        <span className="bg-vapor dark:bg-white/10 text-steel dark:text-ash text-[10px] uppercase font-geist font-medium px-2 py-0.5 rounded-full">Snoozed</span>
                      )}
                    </div>
                    <button className="text-steel dark:text-slate hover:text-carbon dark:hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center shrink-0">
                      {item.vendorLogoUrl ? (
                        <img alt="Vendor Logo" className="w-6 h-6 object-contain rounded-full" src={item.vendorLogoUrl} />
                      ) : (
                        <span className="material-symbols-outlined text-steel dark:text-slate text-[20px]">
                          {isHigh ? "cloud" : "web"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 font-dm-sans">
                      <h3 className="font-geist text-[18px] text-ink-black dark:text-bone leading-tight mb-1 font-medium">{item.title}</h3>
                      <p className="text-[14px] text-steel dark:text-ash mb-4 leading-relaxed">{item.description}</p>

                      {(item.impactAmount || item.actionByText) && (
                        <div className="bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[16px] p-4 mb-4 flex items-center justify-between font-dm-sans">
                          {item.impactAmount && (
                            <div>
                              <div className="font-geist text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-0.5">Estimated Annual Impact</div>
                              <div className="font-geist text-red-600 dark:text-red-400 font-medium">{item.impactAmount}</div>
                            </div>
                          )}
                          {item.affectedWatchlist && (
                            <div className="hidden sm:block">
                              <div className="font-geist text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-0.5">Affected Watchlists</div>
                              <div className="font-geist text-[14px] text-carbon dark:text-bone font-medium">{item.affectedWatchlist}</div>
                            </div>
                          )}
                          {item.actionByText && (
                            <div>
                              <div className="font-geist text-[11px] text-steel dark:text-slate uppercase tracking-wider mb-0.5">Action Required By</div>
                              <div className="font-geist text-[14px] text-carbon dark:text-bone font-medium">{item.actionByText}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 items-center font-dm-sans">
                        <button
                          onClick={() => handleRead(item.id)}
                          disabled={dismissingId === item.id}
                          className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black font-medium text-[12px] px-5 py-2 rounded-full dark:hover:bg-neutral-200 transition-all inline-block shadow-sm"
                        >
                          {dismissingId === item.id ? "Dismissing..." : item.isRead ? "Dismissed" : "Dismiss Alert"}
                        </button>

                        <div className="ml-auto flex gap-1.5">
                          <button
                            onClick={() => handleRead(item.id)}
                            className={`p-2 text-steel dark:text-slate hover:text-carbon dark:hover:text-white transition-colors rounded-full hover:bg-vapor dark:hover:bg-white/10 ${item.isRead ? "text-carbon dark:text-white bg-vapor dark:bg-white/10" : ""
                              }`}
                            title="Mark as Read / Dismiss"
                          >
                            <span className="material-symbols-outlined text-[18px] block">done</span>
                          </button>
                          <button
                            onClick={() => handleSnooze(item.id)}
                            className={`p-2 text-steel dark:text-slate hover:text-carbon dark:hover:text-white transition-colors rounded-full hover:bg-vapor dark:hover:bg-white/10 ${item.isSnoozed ? "text-carbon dark:text-white bg-vapor dark:bg-white/10" : ""
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

        {/* Right Sidebar */}
        <aside className="hidden lg:flex flex-col lg:col-span-4 xl:col-span-3 gap-4 font-dm-sans">
          <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 shadow-sm dark:shadow-glass">
            <h4 className="font-geist text-ink-black dark:text-bone mb-1 flex items-center gap-2 font-medium text-[14px]">
              <span className="material-symbols-outlined text-[18px] text-signal-blue dark:text-white">monitoring</span>
              Alert Health
            </h4>
            <p className="font-geist text-[12px] text-steel dark:text-slate mb-5">Daily notification volume vs. 30-day average.</p>

            <div className="flex items-end gap-[4px] h-24 mb-3 opacity-80 border-b border-bone-light dark:border-white/10 pb-1">
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[30%]"></div>
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[45%]"></div>
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[20%]"></div>
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[55%]"></div>
              <div className="w-full bg-vapor dark:bg-white/5 rounded-t-sm h-[80%] relative">
                <div className="absolute -top-1 left-0 w-full h-[2px] bg-amber-500 dark:bg-amber-400"></div>
              </div>
              <div className="w-full bg-signal-blue/20 dark:bg-white/20 rounded-t-sm h-[95%] border-t-2 border-signal-blue dark:border-white"></div>
            </div>

            <div className="flex justify-between font-geist text-[10px] text-steel dark:text-slate">
              <span>Mon</span>
              <span>Today</span>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};


