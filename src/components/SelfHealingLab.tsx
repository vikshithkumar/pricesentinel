import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type SimState = "healthy" | "broken" | "healing" | "repaired";

export const SelfHealingLab: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vendorParam = searchParams.get("vendor") || "expedia";

  const [simStatus, setSimStatus] = useState<SimState>("healthy");
  const [logs, setLogs] = useState<string[]>([
    "[14:02:10] [INFO] Node initialized successfully.",
    "[14:02:12] [INFO] Target collector SCR-EXP-05 ping OK.",
    "[14:02:15] [INFO] Fetching target DOM tree payload... Done (2.4KB).",
    "[14:02:16] [INFO] Extracting entity values. price_current: $29.99, stock: in_stock."
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
            className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] py-2 px-6 rounded-full font-inter font-medium text-[14px] hover:bg-[#f0f4fe] transition-colors duration-150 flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">warning</span>
            Break Test Website
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch">
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-grow flex flex-col md:flex-row gap-4 items-stretch">
            {/* Target Sandbox */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 w-full md:w-1/2 flex flex-col shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
                <h4 className="font-inter text-[#020520] font-semibold text-[15px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#145aff]">preview</span>
                  Target Sandbox: {vendorParam.toUpperCase()}
                </h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono ${simStatus === "healthy" || simStatus === "repaired" ? "bg-[#16ca2e]/10 text-[#16ca2e]" :
                    simStatus === "healing" ? "bg-[#f0f4fe] text-[#145aff]" : "bg-[#f26052]/10 text-[#f26052]"
                  }`}>
                  {simStatus === "healthy" ? "Live Connected" : simStatus === "healing" ? "Repairing Mapping" : simStatus === "repaired" ? "Repair Ready" : "DOM Mutated"}
                </span>
              </div>

              <div className="flex-grow bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] flex flex-col p-4 items-center justify-center min-h-[220px]">
                <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm w-full max-w-xs text-center relative">
                  <div className="text-[#6b7280] font-mono text-[11px] uppercase tracking-wider">ACME Retail Products</div>
                  <h5 className="font-inter text-[#020520] text-[16px] mt-1 font-semibold">Premium Cloud License</h5>

                  <div className="my-4 py-3 bg-[#f1f5f9] rounded-[12px] border border-[#e2e8f0] border-dashed">
                    {simStatus === "healthy" ? (
                      <div className="text-[#145aff] font-mono text-[28px] font-semibold">
                        $29.99
                      </div>
                    ) : (
                      <div className="text-[#6b7280] font-mono text-[28px] font-semibold line-through decoration-[#f26052]">
                        --
                      </div>
                    )}
                    <span className="text-[10px] font-mono text-[#6b7280] mt-1 block">
                      {simStatus === "healthy" ? "Selector: .product-info > .price-tag" : "Selector Target Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${simStatus === "healthy" ? "bg-[#16ca2e]" : "bg-[#f26052]"}`}></span>
                    <span className="text-[11px] font-inter text-[#374151]">
                      {simStatus === "healthy" ? "Extraction Match Success" : "Null Selector Exception"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DOM Analysis & Code Diff */}
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 w-full md:w-1/2 flex flex-col shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e2e8f0]">
                <h4 className="font-inter text-[#020520] font-semibold text-[15px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#145aff]">code</span>
                  DOM Analysis & Selector Diff
                </h4>
                <span className="text-[11px] text-[#6b7280] font-mono">Ruleset v3.1</span>
              </div>

              <div className="flex-grow bg-[#020520] rounded-[12px] p-3 font-mono text-[11px] leading-relaxed text-[#eeeef0] overflow-y-auto min-h-[220px]">
                <div className="text-[#6b7280] mb-1">// Baseline selector extraction logic</div>
                <div className="pl-2 border-l border-[#145aff]/50 text-[#3b82f6] mb-4">
                  <span className="text-white">const</span> priceText = document.querySelector(
                  <span className="text-[#ffa64d]">'.product-info &gt; .price-tag'</span>
                  ).innerText;
                </div>

                {simStatus !== "healthy" && (
                  <>
                    <div className="text-[#f26052] mb-1 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">error</span>
                        // Selector Error: returns null
                    </div>
                    <div className="pl-2 border-l border-[#f26052] text-[#f26052] line-through opacity-60 mb-4">
                      <span className="text-white">const</span> priceText = document.querySelector(
                      <span className="text-[#f26052]">'.product-info &gt; .price-tag'</span>
                      ).innerText;
                    </div>

                    <div className="text-[#16ca2e] mb-1 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                        // Sentinel AI Repaired Suggestion (Confidence: 98.4%)
                    </div>
                    <div className="pl-2 border-l-2 border-[#16ca2e] bg-[#16ca2e]/10 text-[#16ca2e] p-2 rounded-sm">
                      <span className="text-white">const</span> priceText = document.querySelector(
                      <span className="font-bold underline">'[data-test="current-price"]'</span>
                      ).innerText;
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleRepair}
                  disabled={simStatus !== "repaired"}
                  className="w-full bg-[#16ca2e] hover:bg-[#16ca2e]/90 disabled:bg-[#f1f5f9] disabled:text-[#6b7280] disabled:cursor-not-allowed font-inter font-medium text-white text-[13px] py-2 rounded-full transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Apply Repair Mapping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="font-inter text-[#6b7280] mb-1 text-[12px] font-medium">Recovery Time</div>
              <div className="font-mono text-[24px] font-semibold text-[#020520] flex items-baseline">
                {simStatus === "healing" ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#145aff] border-t-transparent rounded-full animate-spin"></span>
                ) : simStatus === "broken" ? (
                  "Calculating"
                ) : simStatus === "repaired" ? (
                  "18.4"
                ) : (
                  "412"
                )}
                <span className="font-inter text-[#6b7280] text-[12px] ml-1">ms</span>
              </div>
            </div>
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="font-inter text-[#6b7280] mb-1 text-[12px] font-medium">Confidence Score</div>
              <div className="font-mono text-[24px] font-semibold text-[#020520] flex items-baseline">
                {simStatus === "healing" ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#145aff] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "98.4"
                )}
                <span className="font-inter text-[#6b7280] text-[12px] ml-1">%</span>
              </div>
            </div>
            <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-4 col-span-2 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="font-inter text-[#6b7280] mb-2 text-[12px] font-medium">Failed Fields Detected</div>
              <div className="flex flex-wrap gap-2 mt-2 font-mono text-[12px]">
                <span className="px-3 py-1 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full text-[#020520] flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${simStatus === "healthy" || simStatus === "repaired" ? "bg-[#16ca2e]" : "bg-[#f26052] animate-pulse"
                    }`}></span>
                  price_current
                </span>
                <span className="px-3 py-1 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full text-[#020520] flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${simStatus === "healthy" || simStatus === "repaired" ? "bg-[#16ca2e]" : "bg-[#ffa64d] animate-pulse"
                    }`}></span>
                  stock_status
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#020520] text-[#eeeef0] border border-[#e2e8f0] rounded-[16px] p-4 flex-grow h-[260px] flex flex-col font-mono text-[11px] shadow-lg">
            <h4 className="text-[#6b7280] font-inter text-[12px] font-semibold border-b border-[#e2e8f0]/10 pb-2 mb-2 flex justify-between items-center">
              <span>System Heartbeat</span>
              <span className="w-2 h-2 rounded-full bg-[#16ca2e] animate-pulse"></span>
            </h4>
            <div className="flex-grow overflow-y-auto space-y-1.5 pr-1">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed ${log.includes("[WARN]") ? "text-[#ffa64d]" :
                      log.includes("[CRIT]") ? "text-[#f26052]" :
                        log.includes("repaired") || log.includes("Success") ? "text-[#16ca2e]" : "text-[#6b7280]"
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

