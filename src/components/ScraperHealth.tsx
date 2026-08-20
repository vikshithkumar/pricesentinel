import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockScraperNodes, mockPipelineLogs } from "../mockData";
import type { PipelineActivityLog, ScraperNode } from "../mockData";

export const ScraperHealth: React.FC = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<ScraperNode[]>(mockScraperNodes);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const viewMode = "table";
  const [showFreshness, setShowFreshness] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineActivityLog[]>(mockPipelineLogs);

  const [restartingId, setRestartingId] = useState<string | null>(null);

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.collectorId.toLowerCase().includes(searchQuery.toLowerCase());

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

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          bg: "bg-[#16ca2e]/10 text-[#16ca2e] border-[#16ca2e]/20",
          pip: "bg-[#16ca2e]",
          text: "Healthy",
        };
      case "degraded":
        return {
          bg: "bg-[#ffa64d]/10 text-[#ffa64d] border-[#ffa64d]/20",
          pip: "bg-[#ffa64d]",
          text: "Degraded",
        };
      case "recovering":
        return {
          bg: "bg-[#f0f4fe] text-[#145aff] border-[#145aff]/20 animate-pulse",
          pip: "bg-[#145aff] animate-ping",
          text: "Recovering",
        };
      case "failed":
        return {
          bg: "bg-[#f26052]/10 text-[#f26052] border-[#f26052]/20",
          pip: "bg-[#f26052]",
          text: "Failed",
        };
      case "stale":
        return {
          bg: "bg-[#f1f5f9] text-[#374151] border-[#e2e8f0]",
          pip: "bg-[#6b7280]",
          text: "Stale",
        };
      case "critical-stale":
        return {
          bg: "bg-[#f26052]/10 text-[#f26052] border-[#f26052]/20",
          pip: "bg-[#f26052]",
          text: "Critical Stale",
        };
      default:
        return {
          bg: "bg-[#f1f5f9] text-[#6b7280]",
          pip: "bg-[#6b7280]",
          text: "Unknown",
        };
    }
  };

  return (
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 mb-4 font-inter text-[12px] text-[#6b7280]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#145aff] transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>Intelligence</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Scraper Health</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">
            Scraper Nerve Center
          </h1>
          <p className="font-inter text-[#374151] text-[14px] mt-1 max-w-2xl">
            Real-time telemetry and extraction pipeline health for 500+ global vendor sources.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-[#fcfcfc] border border-[#e2e8f0] text-[#020520] rounded-full font-inter text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[#6b7280] text-[18px]">filter_list</span>
            Filter Rules
          </button>
          <button
            onClick={() => navigate("/scrapers/self-healing")}
            className="px-5 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            Self-Healing Lab
          </button>
        </div>
      </div>

      {/* Telemetry Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Global Success Rate</div>
          <div className="font-mono text-[28px] font-semibold text-[#020520] flex items-baseline gap-2">
            99.2%
            <span className="text-[11px] font-mono text-[#16ca2e] bg-[#16ca2e]/10 px-2 py-0.5 rounded-full font-medium">
              Stable
            </span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Avg Latency</div>
          <div className="font-mono text-[28px] font-semibold text-[#020520]">412ms</div>
        </div>

        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
          <div className="text-[#6b7280] font-inter text-[12px] uppercase tracking-wider mb-1 font-medium">Active Scrapers</div>
          <div className="font-mono text-[28px] font-semibold text-[#020520]">512 / 516</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-start">
        <div className="col-span-1 lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-[#ffffff] p-3 border border-[#e2e8f0] rounded-[16px] gap-3 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1 text-[13px] rounded-full font-inter transition-colors duration-150 ${activeTab === tab.id
                      ? "bg-[#f0f4fe] border border-[#145aff] text-[#145aff] font-medium"
                      : "text-[#374151] hover:bg-[#f0f4fe]/60 bg-[#ffffff] border border-[#e2e8f0]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b7280] text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search collectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] font-inter text-[13px] w-full sm:w-48 focus:outline-none focus:border-[#145aff] text-[#020520]"
                />
              </div>

              <button
                onClick={() => setShowFreshness(!showFreshness)}
                className={`p-2 border rounded-[12px] transition-colors duration-150 ${showFreshness
                    ? "bg-[#ffa64d]/10 border-[#ffa64d] text-[#ffa64d]"
                    : "bg-[#ffffff] border-[#e2e8f0] text-[#6b7280] hover:text-[#020520]"
                  }`}
                title="Toggle Freshness View"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
            </div>
          </div>

          {filteredNodes.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-10 flex flex-col items-center justify-center text-center shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] h-96">
              <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#6b7280] mb-4">
                <span className="material-symbols-outlined text-[36px]">filter_list_off</span>
              </div>
              <h3 className="font-inter text-[18px] text-[#020520] font-semibold">No monitored collectors yet</h3>
              <p className="font-inter text-[#6b7280] text-[14px] mt-1 max-w-sm">
                Your current filters or search terms produced zero matches. Clear inputs to return to global active nodes.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full font-inter font-medium text-[13px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Clear Search & Filters
              </button>
            </div>
          ) : viewMode === "table" ? (
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[13px]">
                  <thead>
                    <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] font-inter text-[#374151] text-[12px] font-medium uppercase tracking-wider">
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Collector ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">
                        {showFreshness ? "Freshness Category" : "Success Rate"}
                      </th>
                      <th className="py-3 px-4 text-right">
                        {showFreshness ? "Last Verified" : "Avg Latency"}
                      </th>
                      {!showFreshness && (
                        <th className="py-3 px-4 text-right">
                          Last Scan
                        </th>
                      )}
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] text-[#14141e]">
                    {filteredNodes.map((node) => {
                      const statusInfo = getStatusClasses(node.status);
                      const isStale = node.status === "stale" || node.status === "critical-stale";
                      const isFailed = node.status === "failed";

                      return (
                        <tr key={node.id} className="hover:bg-[#f0f4fe]/60 transition-colors duration-150 group">
                          <td className="py-3.5 px-4 font-inter">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.pip}`}></span>
                              <span className="font-semibold text-[#020520]">{node.vendor}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#6b7280]">{node.collectorId}</td>
                          <td className="py-3.5 px-4 font-inter">
                            <span className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-[11px] font-medium ${statusInfo.bg}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium">
                            {showFreshness ? (
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-inter font-medium ${node.status === "healthy" ? "bg-[#16ca2e]/10 text-[#16ca2e]" :
                                  node.status === "degraded" ? "bg-[#ffa64d]/10 text-[#ffa64d]" :
                                    isStale ? "bg-[#f1f5f9] text-[#6b7280]" : "bg-[#f26052]/10 text-[#f26052]"
                                }`}>
                                {node.status === "healthy" ? "Fresh" :
                                  node.status === "degraded" ? "Aging" :
                                    node.status === "stale" ? "Stale" : "Critical Stale"}
                              </span>
                            ) : (
                              `${node.successRate}%`
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right text-[#6b7280]">
                            {showFreshness ? node.lastScanText : (typeof node.latencyMs === "number" ? `${node.latencyMs}ms` : node.latencyMs)}
                          </td>
                          {!showFreshness && (
                            <td className="py-3.5 px-4 text-right text-[#6b7280]">{node.lastScanText}</td>
                          )}
                          <td className="py-3.5 px-4 text-right font-inter">
                            <div className="flex justify-end gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              {(isFailed || isStale || node.status === "degraded") && (
                                <button
                                  onClick={() => navigate(`/scrapers/self-healing?vendor=${node.id}`)}
                                  className="p-1 bg-[#145aff]/10 text-[#145aff] rounded-full hover:bg-[#145aff] hover:text-white transition-colors"
                                  title="Heal Node Sandbox"
                                >
                                  <span className="material-symbols-outlined text-[16px] block">healing</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleRestartNode(node.id)}
                                className={`p-1 bg-[#fcfcfc] border border-[#e2e8f0] rounded-full hover:bg-[#f0f4fe] transition-colors ${restartingId === node.id ? "animate-spin cursor-not-allowed" : ""
                                  }`}
                                disabled={restartingId !== null}
                                title="Restart Node Collector"
                              >
                                <span className="material-symbols-outlined text-[16px] block text-[#145aff]">restart_alt</span>
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
          ) : null}
        </div>

        {/* Right Column */}
        <div className="col-span-1 lg:col-span-4 space-y-4">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#145aff] text-[20px]">
                auto_fix_high
              </span>
              <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Self-Healing Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 font-mono">
              <div>
                <span className="block text-[12px] text-[#6b7280]">Repairs Today</span>
                <span className="block font-semibold text-[#020520]">147</span>
              </div>
              <div>
                <span className="block text-[12px] text-[#6b7280]">Success Rate</span>
                <span className="block font-semibold text-[#16ca2e]">94%</span>
              </div>
            </div>
            <div className="mb-3 font-mono">
              <span className="block text-[12px] text-[#6b7280]">Avg Recovery</span>
              <span className="block font-semibold text-[#020520]">12s</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
              <button
                onClick={() => navigate("/scrapers/self-healing")}
                className="text-[#145aff] font-inter font-medium text-[13px] hover:underline flex items-center justify-between w-full group transition-colors"
              >
                <span>Go to Self-Healing Lab</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] h-[320px] flex flex-col">
            <h3 className="font-inter text-[#020520] font-semibold text-[15px] mb-3">Pipeline Activity</h3>
            <div className="flex-grow overflow-y-auto space-y-3 pr-1 font-mono text-[12px]">
              {pipelineLogs.map((log) => {
                let colorClass = "bg-[#16ca2e]";
                if (log.type === "warning") colorClass = "bg-[#ffa64d]";
                else if (log.type === "error") colorClass = "bg-[#f26052]";
                else if (log.type === "info") colorClass = "bg-[#145aff]";

                return (
                  <div key={log.id} className="relative pl-2 border-l-2 border-[#e2e8f0] hover:border-[#145aff] transition-colors py-0.5">
                    <div className="flex justify-between items-center text-[11px] text-[#6b7280] mb-0.5">
                      <span>{log.collectorId}</span>
                      <span>{log.timeText}</span>
                    </div>
                    <p className="text-[13px] text-[#020520] leading-snug font-inter">
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

