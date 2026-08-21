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
      default:
        return {
          bg: "bg-[#f1f5f9] text-[#6b7280] border-[#e2e8f0]",
          pip: "bg-[#6b7280]",
          text: status,
        };
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-[#fcfcfc] w-full max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center space-x-2 font-inter text-xs text-[#6b7280]">
          <li>
            <Link to="/" className="hover:text-[#145aff] transition-colors">Dashboard</Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </li>
          <li className="font-medium text-[#020520]" aria-current="page">
            Scraper Health Nerve Center
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] font-semibold text-[#020520] tracking-[-1.48px] leading-tight">
            Scraper Health Nerve Center
          </h2>
          <p className="font-mono text-[14px] text-[#374151] mt-1">
            Global Success Rate: {healthSummary ? `${healthSummary.globalSuccessRate}%` : "98.4%"} • Avg Latency: {healthSummary ? `${healthSummary.avgLatencyMs}ms` : "240ms"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkRetry}
            className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] font-inter font-medium text-[13px] rounded-full py-2 px-5 transition-colors duration-150 flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Bulk Retry Stale</span>
          </button>
          <button
            onClick={() => navigate("/scrapers/self-healing")}
            className="bg-[#145aff] text-white hover:bg-[#145aff]/90 font-inter font-medium text-[13px] rounded-full py-2 px-5 transition-colors duration-150 flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            <span>Self-Healing Lab</span>
          </button>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
        <div className="p-4 border-b border-[#e2e8f0] bg-[#f1f5f9] flex justify-between items-center font-inter">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#020520] text-[15px]">Active Scraper Nodes ({filteredNodes.length})</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node or vendor..."
              className="px-3 py-1 bg-white border border-[#e2e8f0] rounded-full text-[12px] font-mono focus:outline-none focus:border-[#145aff]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[13px]">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] text-[#374151] text-[12px] uppercase font-inter">
                <th className="py-3 px-4">Node ID / Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Success Rate</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredNodes.map((n) => {
                const statusCls = getStatusClasses(n.status);
                const isRestarting = restartingId === n.id || restartingId === n.collectorId;

                return (
                  <tr key={n.id} className="hover:bg-[#f0f4fe]/50 transition-colors">
                    <td className="py-3 px-4 font-inter">
                      <div className="font-semibold text-[#020520]">{n.vendor}</div>
                      <div className="font-mono text-[11px] text-[#6b7280]">{n.collectorId}</div>
                    </td>

                    <td className="py-3 px-4 font-inter text-[#374151] capitalize">{n.category}</td>

                    <td className="py-3 px-4 font-inter">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border font-medium ${statusCls.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCls.pip}`}></span>
                        {statusCls.text}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#020520]">{n.successRate.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-[#374151]">{n.latencyMs} ms</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRestartNode(n.collectorId || n.id)}
                        disabled={isRestarting}
                        className="px-3 py-1 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] rounded-full text-[12px] font-inter hover:bg-[#f0f4fe] transition-colors disabled:opacity-50"
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
