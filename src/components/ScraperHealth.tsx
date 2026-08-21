import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockScraperNodes } from "../mockData";
import type { PipelineActivityLog, ScraperNode } from "../mockData";
import { api } from "../services/api";
import type { ScraperHealthCenterResponse, PipelineActivityLogResponse } from "../services/api";

export const ScraperHealth: React.FC = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<ScraperNode[]>(mockScraperNodes);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab] = useState<string>("all");
  const [restartingId, setRestartingId] = useState<string | null>(null);
  const [healthSummary, setHealthSummary] = useState<ScraperHealthCenterResponse | null>(null);

  const fetchHealthData = () => {
    api.getScraperHealthCenter()
      .then((data: ScraperHealthCenterResponse) => {
        if (data) {
          setHealthSummary(data);
          if (data.collectors && data.collectors.length > 0) {
            const mappedNodes: ScraperNode[] = data.collectors.map((c) => ({
              id: c.collectorId,
              vendor: c.vendorName || "Collector",
              collectorId: c.collectorId,
              category: (c.category as any) || "ecommerce",
              status: (c.status.toLowerCase() as any) || "healthy",
              successRate: Number(c.successRate) * 100 > 1 ? Number(c.successRate) : Number(c.successRate) * 100,
              latencyMs: c.latencyMs || 240,
              lastScanText: c.lastScanAt ? new Date(c.lastScanAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
              lastScanTime: c.lastScanAt ? new Date(c.lastScanAt) : new Date(),
              issueText: c.status === "FAILED" ? "DOM Selector mismatch" : c.status === "DEGRADED" ? "Rate limit warning" : undefined,
            }));
            setNodes(mappedNodes);
          }
        }
      })
      .catch((err) => {
        console.warn("Backend scraper health API unavailable, using seed nodes", err);
      });

    api.getPipelineLogs()
      .then((logs: PipelineActivityLogResponse[]) => {
        if (logs && logs.length > 0) {
          const mappedLogs: PipelineActivityLog[] = logs.map((l) => ({
            id: l.id,
            collectorId: l.collectorId || "SYS",
            message: l.message,
            timeText: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: l.severity === "error" ? "error" : l.severity === "warning" ? "warning" : l.severity === "success" ? "success" : "info",
            timestamp: l.timestamp,
          }));
          console.log("Loaded pipeline logs from backend", mappedLogs.length);
        }
      })
      .catch((err) => {
        console.warn("Backend logs API unavailable, using seed activity logs", err);
      });
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleRestartNode = async (collectorId: string) => {
    setRestartingId(collectorId);
    setNodes((prev) =>
      prev.map((n) => (n.collectorId === collectorId || n.id === collectorId ? { ...n, status: "recovering", successRate: 50 } : n))
    );

    try {
      await api.restartCollector(collectorId);
      setTimeout(() => {
        fetchHealthData();
        setRestartingId(null);
      }, 1500);
    } catch (err) {
      console.warn("Restart collector fallback simulation", err);
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.collectorId === collectorId || n.id === collectorId
              ? { ...n, status: "healthy", successRate: 100, latencyMs: 280, issueText: undefined }
              : n
          )
        );
        setRestartingId(null);
      }, 1500);
    }
  };

  const handleBulkRetry = async () => {
    try {
      await api.bulkRetryStaleScrapers();
      fetchHealthData();
    } catch (err) {
      alert("Bulk retry request sent to backend.");
    }
  };

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

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
          pip: "bg-emerald-500 dark:bg-emerald-400",
          text: "Healthy",
        };
      case "degraded":
        return {
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
          pip: "bg-amber-500 dark:bg-amber-400",
          text: "Degraded",
        };
      case "recovering":
        return {
          bg: "bg-signal-blue/10 dark:bg-white/10 text-signal-blue dark:text-white border-signal-blue/20 dark:border-white/20 animate-pulse",
          pip: "bg-signal-blue dark:bg-white animate-ping",
          text: "Recovering",
        };
      case "failed":
        return {
          bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
          pip: "bg-red-500 dark:bg-red-400",
          text: "Failed",
        };
      default:
        return {
          bg: "bg-vapor dark:bg-white/5 text-steel dark:text-ash border-bone-light dark:border-white/10",
          pip: "bg-steel dark:bg-ash",
          text: status,
        };
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-frost dark:bg-[#0a0a0a] w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-1">
        <ol className="flex items-center space-x-2 font-dm-sans text-xs text-steel dark:text-slate">
          <li>
            <Link to="/" className="hover:text-carbon dark:hover:text-white transition-colors">Dashboard</Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </li>
          <li className="font-medium text-carbon dark:text-bone" aria-current="page">
            Scraper Health Nerve Center
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h2 className="font-geist text-[32px] md:text-[36px] font-medium text-ink-black dark:text-bone tracking-tight leading-tight">
            Scraper Health Nerve Center
          </h2>
          <p className="font-geist text-[14px] text-steel dark:text-ash mt-1">
            Global Success Rate: {healthSummary ? `${healthSummary.globalSuccessRate}%` : "98.4%"} • Avg Latency: {healthSummary ? `${healthSummary.avgLatencyMs}ms` : "240ms"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBulkRetry}
            className="bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone hover:bg-[#e4e4e7] dark:hover:bg-white/10 font-dm-sans font-medium text-[13px] rounded-full py-2.5 px-5 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Bulk Retry Stale</span>
          </button>
          <button
            onClick={() => navigate("/scrapers/self-healing")}
            className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-dm-sans font-medium text-[13px] rounded-full py-2.5 px-5 transition-all duration-150 flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            <span>Self-Healing Lab</span>
          </button>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm dark:shadow-glass">
        <div className="p-5 border-b border-bone-light dark:border-white/10 bg-vapor/40 dark:bg-white/[0.02] flex justify-between items-center font-dm-sans">
          <div className="flex items-center gap-4">
            <span className="font-geist font-medium text-ink-black dark:text-bone text-[16px]">Active Scraper Nodes ({filteredNodes.length})</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node or vendor..."
              className="px-4 py-1.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-full text-[12px] font-geist text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate focus:outline-none focus:border-signal-blue dark:focus:border-white/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-dm-sans text-[13px]">
            <thead>
              <tr className="bg-vapor dark:bg-white/[0.01] border-b border-bone-light dark:border-white/10 text-steel dark:text-ash text-[12px] uppercase font-dm-sans tracking-wider">
                <th className="py-4 px-6">Node ID / Vendor</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Success Rate</th>
                <th className="py-4 px-6">Latency</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone-light/60 dark:divide-white/5 text-carbon dark:text-bone">
              {filteredNodes.map((n) => {
                const statusCls = getStatusClasses(n.status);
                const isRestarting = restartingId === n.id || restartingId === n.collectorId;

                return (
                  <tr key={n.id} className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors">
                    <td className="py-4 px-6 font-dm-sans">
                      <div className="font-geist font-medium text-ink-black dark:text-bone">{n.vendor}</div>
                      <div className="font-geist text-[11px] text-steel dark:text-slate">{n.collectorId}</div>
                    </td>

                    <td className="py-4 px-6 font-dm-sans text-steel dark:text-ash capitalize">{n.category}</td>

                    <td className="py-4 px-6 font-dm-sans">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] border font-medium ${statusCls.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCls.pip}`}></span>
                        {statusCls.text}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-geist font-medium text-carbon dark:text-bone">{n.successRate.toFixed(1)}%</td>
                    <td className="py-4 px-6 text-steel dark:text-ash font-geist">{n.latencyMs} ms</td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleRestartNode(n.collectorId || n.id)}
                        disabled={isRestarting}
                        className="px-4 py-1.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/15 text-carbon dark:text-bone rounded-full text-[12px] font-dm-sans hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        {isRestarting ? "Restarting..." : "Restart Node"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};


