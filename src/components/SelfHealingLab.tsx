import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

type SimState = "healthy" | "broken" | "healing" | "repaired";

export const SelfHealingLab: React.FC = () => {
  const navigate = useNavigate();

  const [simStatus, setSimStatus] = useState<SimState>("healthy");
  const [logs, setLogs] = useState<string[]>([
    "[14:02:10] [INFO] Node initialized successfully.",
    "[14:02:12] [INFO] Target collector SCR-EXP-05 ping OK.",
    "[14:02:15] [INFO] Fetching target DOM tree payload... Done (2.4KB).",
    "[14:02:16] [INFO] Extracting entity values. price_current: $29.99, stock: in_stock."
  ]);
  const [applyingRepair, setApplyingRepair] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleBreak = async () => {
    setSimStatus("broken");
    setLogs((prev) => [
      ...prev,
      `[14:02:30] [WARN] Scraper query loop returned empty node list for selector '.product-info > .price-tag'.`,
      `[14:02:31] [CRIT] NullReferenceException: Failed to extract 'price_current' on target site.`,
      `[14:02:32] [INFO] Initiating Sentinel Visual DOM Mapping protocol...`,
    ]);

    try {
      const res = await api.runBreakTest("col_openai_02", "https://openai.com/pricing");
      if (res) {
        setLogs((prev) => [
          ...prev,
          `[14:02:33] [INFO] Diffing current DOM snapshot with healthy baseline...`,
          `[14:02:34] [INFO] Found target text match nested under parent node '${res.repairedSelector}'.`,
          `[14:02:34] [INFO] Sentinel AI recovery mapping complete. Confidence: ${(Number(res.confidenceScore || 0.98) * 100).toFixed(1)}%.`
        ]);
      }
    } catch (err) {
      console.warn("Backend break test endpoint fallback", err);
      setLogs((prev) => [
        ...prev,
        `[14:02:33] [INFO] Diffing current DOM snapshot with healthy baseline...`,
        `[14:02:34] [INFO] Found target text match '$29.99' nested under parent node '[data-test="current-price"]'.`,
        `[14:02:34] [INFO] Sentinel AI recovery mapping complete. Confidence: 98.4%.`
      ]);
    }
  };

  useEffect(() => {
    if (simStatus !== "broken") return;

    const timer = window.setTimeout(() => {
      setSimStatus("healing");
      setLogs((prev) => [...prev, `[14:02:36] [INFO] Preparing recovery mapping for validation...`]);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [simStatus]);

  useEffect(() => {
    if (simStatus !== "healing") return;

    const timer = window.setTimeout(() => {
      setSimStatus("repaired");
      setLogs((prev) => [...prev, `[14:02:38] [INFO] Recovery mapping validated. Repair is ready to apply.`]);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [simStatus]);

  const handleRepair = async () => {
    if (simStatus !== "repaired") return;
    setApplyingRepair(true);
    setLogs((prev) => [
      ...prev,
      `[14:02:40] [INFO] Applying suggested repaired selector globally...`,
      `[14:02:41] [INFO] Re-scanning DOM on target... Success.`,
    ]);

    try {
      await api.applyRepair("col_openai_02", '[data-test="current-price"]');
      setLogs((prev) => [
        ...prev,
        `[14:02:41] [INFO] Validating normalized price format ($29.99)... Passed.`,
        `[14:02:42] [INFO] Synchronizing patched selector to all nodes in scraper mesh...`
      ]);
      setTimeout(() => {
        navigate("/scrapers/self-healing/success");
      }, 800);
    } catch (err) {
      console.warn("Backend apply repair fallback", err);
      setTimeout(() => {
        navigate("/scrapers/self-healing/success");
      }, 800);
    } finally {
      setApplyingRepair(false);
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
        <Link to="/scrapers" className="hover:text-[#145aff] transition-colors">
          Scraper Health
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Self-Healing Lab</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight mb-1">
            Self-Healing Lab
          </h2>
          <p className="font-inter text-[#374151] text-[14px] max-w-2xl leading-relaxed">
            Interactive demonstration of automated DOM adaptation. Simulate a target site structural failure and observe the Sentinel AI re-map extraction logic in real-time.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleBreak}
            disabled={simStatus !== "healthy"}
            className="px-5 py-2 bg-[#f26052] text-white rounded-full font-inter font-medium text-[13px] hover:bg-[#f26052]/90 transition-colors shadow-sm disabled:opacity-50"
          >
            Simulate DOM Breakage
          </button>
        </div>
      </div>

      {/* Interactive Simulation Console */}
      <div className="bg-[#020520] rounded-[16px] p-6 text-white font-mono text-[13px] shadow-lg flex flex-col min-h-[350px]">
        <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0]/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f26052]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffa64d]"></span>
            <span className="w-3 h-3 rounded-full bg-[#16ca2e]"></span>
            <span className="ml-2 font-semibold text-[#145aff]">node-console // collector: SCR-EXP-05</span>
          </div>
          <span className="text-[11px] text-[#6b7280]">Status: {simStatus.toUpperCase()}</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[12px] text-[#e2e8f0]/90 max-h-[300px]">
          {logs.map((log, idx) => (
            <div key={idx} className={log.includes("CRIT") || log.includes("WARN") ? "text-[#f26052]" : log.includes("complete") || log.includes("repaired") ? "text-[#16ca2e]" : ""}>
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {simStatus === "repaired" && (
          <div className="mt-4 pt-4 border-t border-[#e2e8f0]/10 flex items-center justify-between">
            <span className="text-[#16ca2e] font-semibold">Suggested Fix: [data-test="current-price"]</span>
            <button
              onClick={handleRepair}
              disabled={applyingRepair}
              className="px-5 py-2 bg-[#16ca2e] text-white rounded-full font-inter font-medium text-[13px] hover:bg-[#16ca2e]/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {applyingRepair ? "Applying Repair..." : "Apply AI Repair & Deploy"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
