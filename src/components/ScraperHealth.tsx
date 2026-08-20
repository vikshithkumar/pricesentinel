import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockScraperNodes, mockPipelineLogs } from "../mockData";
import type { PipelineActivityLog, ScraperNode } from "../mockData";

export const ScraperHealth: React.FC = () => {
  const navigate = useNavigate();

  // Local state for interactive scrapers list
  const [nodes, setNodes] = useState<ScraperNode[]>(mockScraperNodes);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all"); // 'all', 'ecommerce', 'travel', 'financial', 'down'
  const viewMode = "table";
  const [showFreshness, setShowFreshness] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineActivityLog[]>(mockPipelineLogs);

  // Restart Node simulated spinner
  const [restartingId, setRestartingId] = useState<string | null>(null);

  // Filter logic
  const filteredNodes = nodes.filter((node) => {
    // Search filter
    const matchesSearch =
      node.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.collectorId.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (activeTab === "ecommerce") matchesCategory = node.category === "ecommerce";
    else if (activeTab === "travel") matchesCategory = node.category === "travel";
    else if (activeTab === "financial") matchesCategory = node.category === "financial";
    else if (activeTab === "down") matchesCategory = node.status === "failed";

    return matchesSearch && matchesCategory;
  });

  const handleRestartNode = (id: string) => {
    setRestartingId(id);
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "recovering", successRate: 50 } : n))
    );
  };

  useEffect(() => {
    if (restartingId) {
      const timer = setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === restartingId
              ? { ...n, status: "healthy", successRate: 100, latencyMs: 280, issueText: undefined }
              : n
          )
        );
        setRestartingId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [restartingId]);

  useEffect(() => {
    const heartbeat = window.setInterval(() => {
      const template = mockPipelineLogs[Math.floor(Math.random() * mockPipelineLogs.length)];
      setPipelineLogs((previous) => [
        {
          ...template,
          id: `heartbeat-${Date.now()}`,
          timeText: "Just now",
        },
        ...previous,
      ].slice(0, 8));
    }, 8000);

    return () => window.clearInterval(heartbeat);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  // Helper status styling
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          bg: "bg-success-green/10 text-success-green border-success-green/20",
          pip: "bg-success-green",
          text: "Healthy",
        };
      case "degraded":
        return {
          bg: "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
          pip: "bg-warning-amber",
          text: "Degraded",
        };
      case "recovering":
        return {
          bg: "bg-primary-fixed text-primary border-primary-container/20 animate-pulse",
          pip: "bg-primary animate-ping",
          text: "Recovering",
        };
      case "failed":
        return {
          bg: "bg-error-container text-critical-red border-error-container/20",
          pip: "bg-critical-red",
          text: "Failed",
        };
      case "stale":
        return {
          bg: "bg-secondary-container text-secondary border-outline-variant/30",
          pip: "bg-secondary",
          text: "Stale",
        };
      case "critical-stale":
        return {
          bg: "bg-error-container text-critical-red border-error-container/20",
          pip: "bg-critical-red",
          text: "Critical Stale",
        };
      default:
        return {
          bg: "bg-surface-container text-secondary",
          pip: "bg-outline",
          text: "Unknown",
        };
    }
  };

  return (
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs mb-md text-nav-link font-nav-link" aria-label="Breadcrumb">
        <Link to="/" className="text-secondary hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-secondary">Intelligence</span>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-ink font-medium">Scraper Health</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-ink font-bold tracking-tight">
            Scraper Nerve Center
          </h1>
          <p className="font-body text-secondary text-[14px] mt-xs max-w-2xl">
            Real-time telemetry and extraction pipeline health for 500+ global vendor sources.
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            className="px-md py-sm bg-surface-pearl border border-hairline text-ink rounded-full font-body text-[14px] hover:bg-surface-container-low transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">filter_list</span>
            Filter Rules
          </button>
          <button
            onClick={() => navigate("/scrapers/self-healing")}
            className="px-md py-sm bg-primary text-on-primary rounded-full font-body-strong text-[14px] hover:bg-surface-tint transition-all flex items-center gap-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            Self-Healing Lab
          </button>
        </div>
      </div>

      {/* Telemetry Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm mb-lg">
        {/* Global Success Rate */}
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Global Success Rate</div>
          <div className="font-display-md text-[28px] font-bold text-ink flex items-baseline gap-2">
            99.2%
            <span className="text-[11px] font-data-tabular text-success-green bg-success-green/10 px-1.5 py-0.5 rounded">
              Stable
            </span>
          </div>
        </div>

        {/* Avg Latency */}
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Avg Latency</div>
          <div className="font-display-md text-[28px] font-bold text-ink">412ms</div>
        </div>

        {/* Active Scrapers */}
        <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
          <div className="text-secondary font-label-capsule text-[12px] mb-xxs">Active Scrapers</div>
          <div className="font-display-md text-[28px] font-bold text-ink">512 / 516</div>
        </div>
      </div>

      {/* Grid Layout: Main Scraper content + Logs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-grow items-start">

        {/* Left Column: Filters + Scrapers Container */}
        <div className="col-span-1 lg:col-span-8 space-y-md">

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-canvas-white p-sm border border-hairline rounded-lg gap-sm shadow-sm">
            {/* Filter chips */}
            <div className="flex flex-wrap gap-xs">
              {[
                { id: "all", label: "All Sources" },
                { id: "ecommerce", label: "E-Commerce" },
                { id: "travel", label: "Travel" },
                { id: "financial", label: "Financial" },
                { id: "down", label: "Offline" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-sm py-1 text-[13px] rounded font-body-strong transition-all ${activeTab === tab.id
                      ? "bg-primary text-canvas-white shadow-xs"
                      : "text-secondary hover:text-ink bg-surface-pearl border border-hairline"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right actions: Search + Freshness Toggle */}
            <div className="flex items-center gap-xs w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-grow sm:flex-grow-0">
                <span className="material-symbols-outlined absolute left-xs top-1/2 -translate-y-1/2 text-secondary text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search collectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-sm py-1 rounded-md border border-hairline bg-canvas-parchment font-body text-[13px] w-full sm:w-48 focus:outline-none focus:border-primary text-ink"
                />
              </div>

              {/* Freshness mode button */}
              <button
                onClick={() => setShowFreshness(!showFreshness)}
                className={`p-1.5 border rounded-md transition-colors ${showFreshness
                    ? "bg-warning-amber/10 border-warning-amber text-warning-amber"
                    : "bg-surface-pearl border-hairline text-secondary hover:text-ink"
                  }`}
                title="Toggle Freshness View"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
            </div>
          </div>

          {/* List Display (Conditional Empty State) */}
          {filteredNodes.length === 0 ? (
            /* Scraper Health Center Empty State */
            <div className="bg-canvas-white border border-hairline rounded-lg p-xl flex flex-col items-center justify-center text-center shadow-sm h-96">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary mb-md">
                <span className="material-symbols-outlined text-[36px]">filter_list_off</span>
              </div>
              <h3 className="font-tagline text-[18px] text-ink font-semibold">No monitored collectors yet</h3>
              <p className="font-body text-secondary text-[14px] mt-xs max-w-sm">
                Your current filters or search terms produced zero matches. Clear inputs to return to global active nodes.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-lg px-xl py-sm bg-primary text-canvas-white rounded-full font-body-strong text-[13px] hover:bg-surface-tint transition-all shadow-sm flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Clear Search & Filters
              </button>
            </div>
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="bg-canvas-white border border-hairline rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-canvas-parchment border-b border-hairline">
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Vendor</th>
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Collector ID</th>
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase">Status</th>
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase text-center">
                        {showFreshness ? "Freshness Category" : "Success Rate"}
                      </th>
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase text-right">
                        {showFreshness ? "Last Verified" : "Avg Latency"}
                      </th>
                      {!showFreshness && (
                        <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase text-right">
                          Last Scan
                        </th>
                      )}
                      <th className="py-2.5 px-md font-label-capsule text-[12px] text-secondary font-medium uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-[13px] text-ink divide-y divide-hairline">
                    {filteredNodes.map((node) => {
                      const statusInfo = getStatusClasses(node.status);
                      const isStale = node.status === "stale" || node.status === "critical-stale";
                      const isFailed = node.status === "failed";

                      return (
                        <tr key={node.id} className="hover:bg-surface-bright transition-colors group">
                          <td className="py-3 px-md flex items-center gap-sm">
                            <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.pip}`}></span>
                            <span className="font-semibold">{node.vendor}</span>
                          </td>
                          <td className="py-3 px-md text-secondary font-mono">{node.collectorId}</td>
                          <td className="py-3 px-md">
                            <span className={`inline-flex items-center px-2 py-0.5 border rounded-full text-[11px] font-medium ${statusInfo.bg}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          {/* Success % / Freshness Category */}
                          <td className="py-3 px-md text-center font-medium">
                            {showFreshness ? (
                              <span className={`font-body-strong px-2 py-0.5 rounded text-[11px] font-semibold ${node.status === "healthy" ? "bg-success-green/10 text-success-green" :
                                  node.status === "degraded" ? "bg-warning-amber/10 text-warning-amber" :
                                    isStale ? "bg-secondary-container text-secondary" : "bg-error-container text-critical-red"
                                }`}>
                                {node.status === "healthy" ? "Fresh" :
                                  node.status === "degraded" ? "Aging" :
                                    node.status === "stale" ? "Stale" : "Critical Stale"}
                              </span>
                            ) : (
                              `${node.successRate}%`
                            )}
                          </td>
                          {/* Latency / Last Scan */}
                          <td className="py-3 px-md text-right font-medium text-secondary">
                            {showFreshness ? node.lastScanText : (typeof node.latencyMs === "number" ? `${node.latencyMs}ms` : node.latencyMs)}
                          </td>
                          {!showFreshness && (
                            <td className="py-3 px-md text-right font-medium text-secondary">{node.lastScanText}</td>
                          )}
                          {/* Hover Actions */}
                          <td className="py-3 px-md text-right">
                            <div className="flex justify-end gap-xs md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              {(isFailed || isStale || node.status === "degraded") && (
                                <button
                                  onClick={() => navigate(`/scrapers/self-healing?vendor=${node.id}`)}
                                  className="p-1 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-canvas-white transition-colors"
                                  title="Heal Node Sandbox"
                                >
                                  <span className="material-symbols-outlined text-[16px] block">healing</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleRestartNode(node.id)}
                                className={`p-1 bg-surface-pearl border border-hairline rounded hover:bg-surface-container transition-colors ${restartingId === node.id ? "animate-spin cursor-not-allowed" : ""
                                  }`}
                                disabled={restartingId !== null}
                                title="Restart Node Collector"
                              >
                                <span className="material-symbols-outlined text-[16px] block">restart_alt</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Bento Cards Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {filteredNodes.map((node) => {
                const statusInfo = getStatusClasses(node.status);
                const isFailed = node.status === "failed";
                const isStale = node.status === "stale" || node.status === "critical-stale";

                return (
                  <div
                    key={node.id}
                    className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm flex flex-col justify-between h-40 hover:border-primary/40 transition-colors relative group"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-sm">
                          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.pip}`}></span>
                          <h4 className="font-body-strong text-ink font-semibold text-[15px]">{node.vendor}</h4>
                        </div>
                        <span className="font-mono text-secondary text-[11px]">{node.collectorId}</span>
                      </div>

                      {/* Telemetry info */}
                      <div className="grid grid-cols-2 gap-sm mt-md">
                        <div>
                          <span className="block text-[10px] text-secondary uppercase font-semibold">Rate</span>
                          <span className="font-data-tabular font-bold text-ink text-[14px]">{node.successRate}%</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-secondary uppercase font-semibold">Latency</span>
                          <span className="font-data-tabular font-bold text-ink text-[14px]">
                            {typeof node.latencyMs === "number" ? `${node.latencyMs}ms` : node.latencyMs}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline pt-sm mt-xs">
                      <span className={`inline-flex items-center px-1.5 py-0.5 border rounded-full text-[10px] font-medium ${statusInfo.bg}`}>
                        {statusInfo.text}
                      </span>
                      <div className="flex gap-xs md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {(isFailed || isStale || node.status === "degraded") && (
                          <button
                            onClick={() => navigate(`/scrapers/self-healing?vendor=${node.id}`)}
                            className="p-1 bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary hover:text-canvas-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px] block">healing</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleRestartNode(node.id)}
                          className="p-1 bg-surface-pearl border border-hairline rounded hover:bg-surface-container transition-colors"
                          disabled={restartingId !== null}
                        >
                          <span className="material-symbols-outlined text-[15px] block">restart_alt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Pipeline Log Streams & Lab Shortcut */}
        <div className="col-span-1 lg:col-span-4 space-y-md">

          {/* Self-Healing Stats Card */}
          <div className="bg-surface-pearl border border-hairline rounded-lg p-md shadow-sm">
            <div className="flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_fix_high
              </span>
              <h3 className="font-body-strong text-body-strong text-ink font-semibold">Self-Healing Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-sm mb-sm">
              <div>
                <span className="block font-data-tabular text-[12px] text-secondary">Repairs Today</span>
                <span className="block font-body-strong text-ink font-semibold">147</span>
              </div>
              <div>
                <span className="block font-data-tabular text-[12px] text-secondary">Success Rate</span>
                <span className="block font-body-strong text-success-green font-semibold">94%</span>
              </div>
            </div>
            <div className="mb-sm">
              <span className="block font-data-tabular text-[12px] text-secondary">Avg Recovery</span>
              <span className="block font-body-strong text-ink font-semibold">12s</span>
            </div>
            <div className="mt-md pt-sm border-t border-hairline">
              <button
                onClick={() => navigate("/scrapers/self-healing")}
                className="text-primary hover:text-primary/80 font-data-tabular font-semibold flex items-center justify-between w-full group transition-colors"
              >
                <span>Go to Self-Healing Lab</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Pipeline Activity Logs */}
          <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm h-[320px] flex flex-col">
            <h3 className="font-body-strong text-body-strong text-ink font-semibold mb-md">Pipeline Activity</h3>
            <div className="flex-grow overflow-y-auto space-y-md pr-xxs">
              {pipelineLogs.map((log) => {
                let colorClass = "bg-success-green";
                if (log.type === "warning") colorClass = "bg-warning-amber";
                else if (log.type === "error") colorClass = "bg-critical-red";
                else if (log.type === "info") colorClass = "bg-primary";

                return (
                  <div key={log.id} className="relative pl-xs border-l-2 border-hairline hover:border-primary transition-colors py-0.5">
                    <div className="flex justify-between items-center text-[11px] font-data-tabular text-secondary mb-0.5">
                      <span>{log.collectorId}</span>
                      <span>{log.timeText}</span>
                    </div>
                    <p className="text-[13px] text-ink leading-snug">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${colorClass}`}></span>
                      {log.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};
