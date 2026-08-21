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
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4 text-[12px] text-[#6b7280] font-inter">
        <span className="hover:text-[#145aff] cursor-pointer transition-colors">Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Alerts</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">Intelligence Feed</h2>
          <p className="font-inter text-[14px] text-[#374151] mt-1 max-w-2xl">Monitor and respond to critical pricing changes, vendor risk signals, and structural market shifts.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] px-4 py-2 flex items-center gap-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wider font-medium">Active Risks</span>
              <span className="font-mono text-[24px] font-semibold text-[#020520] leading-none mt-1">{alerts.length}</span>
            </div>
            <div className="w-px h-8 bg-[#e2e8f0]"></div>
            <div className="flex flex-col">
              <span className="font-mono text-[#f26052] text-[10px] uppercase tracking-wider font-semibold">Critical</span>
              <span className="font-mono text-[24px] font-semibold text-[#f26052] leading-none mt-1">
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
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-3 flex flex-wrap gap-3 items-center sticky top-0 z-20 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] font-inter">
            <span className="font-mono text-[13px] text-[#6b7280] mr-1">Filters:</span>
            <button className="bg-[#f1f5f9] hover:bg-[#f0f4fe] border border-[#e2e8f0] text-[#020520] text-[12px] px-3 py-1 rounded-full transition-colors flex items-center gap-1">
              Severity <span className="material-symbols-outlined text-[16px] text-[#6b7280]">expand_more</span>
            </button>
            {categoryFilter && (
              <button
                onClick={() => setCategoryFilter("")}
                className="bg-[#f0f4fe] border border-[#145aff] text-[#145aff] text-[12px] font-medium px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                Category: {categoryFilter} <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
            <button className="bg-[#f1f5f9] hover:bg-[#f0f4fe] border border-[#e2e8f0] text-[#020520] text-[12px] px-3 py-1 rounded-full transition-colors flex items-center gap-1">
              Vendor <span className="material-symbols-outlined text-[16px] text-[#6b7280]">expand_more</span>
            </button>

            {/* Search Input */}
            <div className="relative ml-auto w-48 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[16px]">search</span>
              <input
                className="w-full bg-[#f1f5f9] focus:bg-[#ffffff] border border-[#e2e8f0] rounded-full py-1 pl-8 pr-3 font-mono text-[12px] text-[#020520] focus:outline-none focus:border-[#145aff]"
                placeholder="Search feed..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Alert Cards */}
          {filteredAlerts.length === 0 ? (
            <div className="border border-[#e2e8f0] border-dashed rounded-[16px] p-10 text-center bg-[#ffffff] shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 mb-4 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#6b7280]">
                <span className="material-symbols-outlined text-[36px]">notifications_off</span>
              </div>
              <h3 className="font-inter text-[18px] text-[#020520] font-semibold">No alerts matching filters</h3>
              <p className="font-inter text-[#6b7280] text-[14px] mt-1">Try clearing search terms or modifying severity categories.</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isCritical = item.severity === "critical";
              const isHigh = item.severity === "high";
              const leftBorderClass = isCritical ? "bg-[#f26052]" : isHigh ? "bg-[#ffa64d]" : "bg-[#3b82f6]";
              const titleClass = isCritical ? "text-[#f26052]" : isHigh ? "text-[#ffa64d]" : "text-[#3b82f6]";

              return (
                <article
                  key={item.id}
                  className={`bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 md:p-6 hover:border-[#145aff]/40 transition-colors duration-150 group relative overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] ${item.isRead ? "opacity-60" : ""
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${leftBorderClass}`}></div>

                  <div className="flex justify-between items-start mb-3 font-inter">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${isCritical ? "bg-[#f26052]/10 text-[#f26052]" : "bg-[#f1f5f9] text-[#6b7280]"
                        }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCritical ? "warning" : isHigh ? "error" : "info"}
                        </span>
                      </span>
                      <span className={`font-mono text-[12px] font-semibold uppercase tracking-wider ${titleClass}`}>
                        {item.severity} Risk
                      </span>
                      <span className="text-[#6b7280] text-[12px]">•</span>
                      <span className="font-mono text-[12px] text-[#6b7280]">{item.timeText}</span>
                      {item.isSnoozed && (
                        <span className="bg-[#f1f5f9] text-[#6b7280] text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded-full">Snoozed</span>
                      )}
                    </div>
                    <button className="text-[#6b7280] hover:text-[#020520] transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                      {item.vendorLogoUrl ? (
                        <img alt="Vendor Logo" className="w-6 h-6 object-contain rounded-full" src={item.vendorLogoUrl} />
                      ) : (
                        <span className="material-symbols-outlined text-[#6b7280] text-[20px]">
                          {isHigh ? "cloud" : "web"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 font-inter">
                      <h3 className="text-[18px] text-[#020520] leading-tight mb-1 font-semibold">{item.title}</h3>
                      <p className="text-[14px] text-[#374151] mb-3 leading-relaxed">{item.description}</p>

                      {(item.impactAmount || item.actionByText) && (
                        <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] p-3 mb-4 flex items-center justify-between font-inter">
                          {item.impactAmount && (
                            <div>
                              <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-0.5">Estimated Annual Impact</div>
                              <div className="font-mono text-[#f26052] font-semibold">{item.impactAmount}</div>
                            </div>
                          )}
                          {item.affectedWatchlist && (
                            <div className="hidden sm:block">
                              <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-0.5">Affected Watchlists</div>
                              <div className="font-inter text-[14px] text-[#020520] font-semibold">{item.affectedWatchlist}</div>
                            </div>
                          )}
                          {item.actionByText && (
                            <div>
                              <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-wider mb-0.5">Action Required By</div>
                              <div className="font-inter text-[14px] text-[#020520] font-semibold">{item.actionByText}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 items-center font-inter">
                        <button
                          onClick={() => handleRead(item.id)}
                          disabled={dismissingId === item.id}
                          className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-medium text-[12px] px-4 py-1.5 rounded-full hover:bg-[#f0f4fe] transition-colors duration-150 inline-block shadow-sm"
                        >
                          {dismissingId === item.id ? "Dismissing..." : item.isRead ? "Dismissed" : "Dismiss Alert"}
                        </button>

                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => handleRead(item.id)}
                            className={`p-1.5 text-[#6b7280] hover:text-[#145aff] transition-colors rounded-full hover:bg-[#f0f4fe] ${item.isRead ? "text-[#145aff] bg-[#f0f4fe]" : ""
                              }`}
                            title="Mark as Read / Dismiss"
                          >
                            <span className="material-symbols-outlined text-[18px] block">done</span>
                          </button>
                          <button
                            onClick={() => handleSnooze(item.id)}
                            className={`p-1.5 text-[#6b7280] hover:text-[#145aff] transition-colors rounded-full hover:bg-[#f0f4fe] ${item.isSnoozed ? "text-[#145aff] bg-[#f0f4fe]" : ""
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
        <aside className="hidden lg:flex flex-col lg:col-span-4 xl:col-span-3 gap-4 font-inter">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <h4 className="font-inter text-[#020520] mb-1 flex items-center gap-1.5 font-semibold text-[14px]">
              <span className="material-symbols-outlined text-[18px] text-[#145aff]">monitoring</span>
              Alert Health
            </h4>
            <p className="font-mono text-[12px] text-[#6b7280] mb-4">Daily notification volume vs. 30-day average.</p>

            <div className="flex items-end gap-[3px] h-20 mb-2 opacity-70 border-b border-[#e2e8f0] pb-1">
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[30%]"></div>
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[45%]"></div>
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[20%]"></div>
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[55%]"></div>
              <div className="w-full bg-[#f1f5f9] rounded-t-sm h-[80%] relative">
                <div className="absolute -top-1 left-0 w-full h-[2px] bg-[#ffa64d]"></div>
              </div>
              <div className="w-full bg-[#145aff]/20 rounded-t-sm h-[95%] border-t-2 border-[#145aff]"></div>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-[#6b7280]">
              <span>Mon</span>
              <span>Today</span>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};
