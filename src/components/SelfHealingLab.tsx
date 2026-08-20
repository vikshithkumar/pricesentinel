import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type SimState = "healthy" | "broken" | "healing" | "repaired";

export const SelfHealingLab: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vendorParam = searchParams.get("vendor") || "expedia";

  // Simulation states
  const [simStatus, setSimStatus] = useState<SimState>("healthy");
  const [logs, setLogs] = useState<string[]>([
    "[14:02:10] [INFO] Node initialized successfully.",
    "[14:02:12] [INFO] Target collector SCR-EXP-05 ping OK.",
    "[14:02:15] [INFO] Fetching target DOM tree payload... Done (2.4KB).",
    "[14:02:16] [INFO] Extracting entity values. price_current: $29.99, stock: in_stock."
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Handle Break Test
  const handleBreak = () => {
    setSimStatus("broken");
    setLogs((prev) => [
      ...prev,
      `[14:02:30] [WARN] Scraper query loop returned empty node list for selector '.product-info > .price-tag'.`,
      `[14:02:31] [CRIT] NullReferenceException: Failed to extract 'price_current' on target site.`,
      `[14:02:32] [INFO] Initiating Sentinel Visual DOM Mapping protocol...`,
      `[14:02:33] [INFO] Diffing current DOM snapshot with healthy baseline...`,
      `[14:02:34] [INFO] Found target text match '$29.99' nested under parent node '[data-test="current-price"]'.`,
      `[14:02:34] [INFO] Sentinel AI recovery mapping complete. Confidence: 98.4%.`
    ]);
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

  // Handle Apply Repair
  const handleRepair = () => {
    if (simStatus !== "repaired") return;
    setLogs((prev) => [
      ...prev,
      `[14:02:40] [INFO] Applying suggested repaired selector globally...`,
      `[14:02:41] [INFO] Re-scanning DOM on target... Success.`,
      `[14:02:41] [INFO] Validating normalized price format ($29.99)... Passed.`,
      `[14:02:42] [INFO] Synchronizing patched selector to all nodes in scraper mesh...`
    ]);

    navigate("/scrapers/self-healing/success");
  };



  return (
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs mb-md text-nav-link font-nav-link" aria-label="Breadcrumb">
        <Link to="/" className="text-secondary hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <Link to="/scrapers" className="text-secondary hover:text-primary transition-colors">
          Scraper Health
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-ink font-medium">Self-Healing Lab</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-ink font-bold mb-xs">
            Self-Healing Lab
          </h2>
          <p className="font-body text-secondary text-[14px] max-w-2xl leading-relaxed">
            Interactive demonstration of automated DOM adaptation. Simulate a target site structural failure and observe the Sentinel AI re-map extraction logic in real-time.
          </p>
        </div>
        <div className="flex gap-sm shrink-0">
          <button
            onClick={handleBreak}
            disabled={simStatus !== "healthy"}
            className="bg-primary text-on-primary py-sm px-lg rounded-full font-body-strong text-[14px] hover:scale-95 hover:bg-surface-tint active:scale-95 transition-all flex items-center gap-xs shadow-[0px_10px_40px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">warning</span>
            Break Test Website
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-grow items-stretch">

        {/* Left Column: Visual Simulator (8 cols) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-gutter">
          {/* DOM Logic repair screen split columns */}
          <div className="flex-grow flex flex-col md:flex-row gap-md items-stretch">

            {/* Target Visualization Pane (Bloomberg style sandbox container) */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md w-full md:w-1/2 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-md pb-xs border-b border-hairline">
                <h4 className="font-body-strong text-ink font-semibold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">preview</span>
                  Target Sandbox: {vendorParam.toUpperCase()}
                </h4>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium font-data-tabular ${simStatus === "healthy" || simStatus === "repaired" ? "bg-success-green/10 text-success-green" :
                    simStatus === "healing" ? "bg-primary-fixed text-primary" : "bg-error-container text-critical-red"
                  }`}>
                  {simStatus === "healthy" ? "Live Connected" : simStatus === "healing" ? "Repairing Mapping" : simStatus === "repaired" ? "Repair Ready" : "DOM Mutated"}
                </span>
              </div>

              {/* Simulated Target browser content frame */}
              <div className="flex-grow bg-[#fafafc] border border-hairline rounded flex flex-col p-md items-center justify-center min-h-[220px]">
                <div className="bg-canvas-white border border-hairline rounded-lg p-lg shadow-sm w-full max-w-xs text-center relative">
                  <div className="text-secondary font-label-capsule text-[11px] uppercase tracking-wider">ACME Retail Products</div>
                  <h5 className="font-body-strong text-ink text-[16px] mt-xs font-semibold">Premium Cloud License</h5>

                  <div className="my-md py-sm bg-canvas-parchment rounded border border-hairline border-dashed">
                    {simStatus === "healthy" ? (
                      <div className="text-primary font-display-md text-[28px] font-bold animate-fade-in">
                        $29.99
                      </div>
                    ) : (
                      <div className="text-secondary font-display-md text-[28px] font-bold line-through decoration-critical-red animate-pulse">
                        --
                      </div>
                    )}
                    <span className="text-[10px] font-mono text-secondary mt-1 block">
                      {simStatus === "healthy" ? "Selector: .product-info > .price-tag" : "Selector Target Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${simStatus === "healthy" ? "bg-success-green" : "bg-critical-red"}`}></span>
                    <span className="text-[11px] text-secondary font-medium">
                      {simStatus === "healthy" ? "Extraction Match Success" : "Null Selector Exception"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DOM Analysis & Code Diff Pane */}
            <div className="bg-canvas-white border border-hairline rounded-lg p-md w-full md:w-1/2 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-md pb-xs border-b border-hairline">
                <h4 className="font-body-strong text-ink font-semibold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">code</span>
                  DOM Analysis & Selector Diff
                </h4>
                <span className="text-[11px] text-secondary font-data-tabular">Ruleset v3.1</span>
              </div>

              {/* Fenced Code Editor mockup */}
              <div className="flex-grow bg-[#1a1c1d] rounded p-sm font-mono text-[11px] leading-relaxed text-[#eeeef0] overflow-y-auto min-h-[220px]">
                {/* Baseline code */}
                <div className="text-secondary mb-1">// Baseline selector extraction logic</div>
                <div className="pl-xs border-l border-primary/50 text-[#aac7ff] mb-md">
                  <span className="text-[#e2e2e4]">const</span> priceText = document.querySelector(
                  <span className="text-[#ff9f0a]">'.product-info &gt; .price-tag'</span>
                  ).innerText;
                </div>

                {/* Mutated code (conditional) */}
                {simStatus !== "healthy" && (
                  <>
                    <div className="text-[#ff3b30] mb-1 font-semibold flex items-center gap-xxs">
                      <span className="material-symbols-outlined text-[12px]">error</span>
                        // Selector Error: returns null
                    </div>
                    <div className="pl-xs border-l border-[#ff3b30] text-[#ffdad6] line-through opacity-60 mb-md">
                      <span className="text-[#e2e2e4]">const</span> priceText = document.querySelector(
                      <span className="text-[#ff3b30]">'.product-info &gt; .price-tag'</span>
                      ).innerText;
                    </div>

                    {/* Sentinel AI Suggestion */}
                    <div className="text-success-green mb-1 font-semibold flex items-center gap-xxs">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                        // Sentinel AI Repaired Suggestion (Confidence: 98.4%)
                    </div>
                    <div className="pl-xs border-l-2 border-success-green bg-success-green/10 text-success-green p-xs rounded-sm">
                      <span className="text-[#eeeef0]">const</span> priceText = document.querySelector(
                      <span className="font-bold underline">'[data-test="current-price"]'</span>
                      ).innerText;
                    </div>
                  </>
                )}
              </div>

              <div className="mt-md">
                <button
                  onClick={handleRepair}
                  disabled={simStatus !== "repaired"}
                  className="w-full bg-[#28a745] hover:bg-success-green/90 disabled:bg-surface-container disabled:text-secondary disabled:cursor-not-allowed font-body-strong text-canvas-white text-[13px] py-2 rounded-full transition-colors flex items-center justify-center gap-xs shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Apply Repair Mapping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry metrics & Live Logs Output */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-md">

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
              <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px]">Recovery Time</div>
              <div className="font-display-md text-[24px] font-bold text-ink flex items-baseline">
                {simStatus === "healing" ? (
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : simStatus === "broken" ? (
                  "Calculating"
                ) : simStatus === "repaired" ? (
                  "18.4"
                ) : (
                  "412"
                )}
                <span className="font-body text-secondary text-[12px] ml-xxs">ms</span>
              </div>
            </div>
            <div className="bg-canvas-white border border-hairline rounded-lg p-md shadow-sm">
              <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px]">Confidence Score</div>
              <div className="font-display-md text-[24px] font-bold text-ink flex items-baseline">
                {simStatus === "healing" ? (
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "98.4"
                )}
                <span className="font-body text-secondary text-[12px] ml-xxs">%</span>
              </div>
            </div>
            <div className="bg-canvas-white border border-hairline rounded-lg p-md col-span-2 shadow-sm">
              <div className="font-nav-link text-nav-link text-secondary mb-xs text-[12px]">Failed Fields Detected</div>
              <div className="flex flex-wrap gap-xs mt-sm">
                <span className="px-sm py-1 bg-surface-pearl border border-hairline rounded-full font-data-tabular text-[13px] text-ink flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-xs ${simStatus === "healthy" || simStatus === "repaired" ? "bg-success-green" : "bg-critical-red animate-pulse"
                    }`}></span>
                  price_current
                </span>
                <span className="px-sm py-1 bg-surface-pearl border border-hairline rounded-full font-data-tabular text-[13px] text-ink flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-xs ${simStatus === "healthy" || simStatus === "repaired" ? "bg-success-green" : "bg-warning-amber animate-pulse"
                    }`}></span>
                  stock_status
                </span>
              </div>
            </div>
          </div>

          {/* System logs heartbeat output */}
          <div className="bg-[#1a1c1d] text-[#eeeef0] border border-hairline rounded-lg p-md flex-grow h-[260px] flex flex-col font-mono text-[11px] shadow-lg">
            <h4 className="text-secondary font-sans text-[12px] font-semibold border-b border-canvas-white/10 pb-xs mb-sm flex justify-between items-center">
              <span>System Heartbeat</span>
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
            </h4>
            <div className="flex-grow overflow-y-auto space-y-xs pr-xxs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed animate-fade-in ${log.includes("[WARN]") ? "text-[#ff9f0a]" :
                      log.includes("[CRIT]") ? "text-[#ff3b30]" :
                        log.includes("repaired") || log.includes("Success") ? "text-success-green" : "text-secondary-fixed-dim"
                    }`}
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef}></div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};
