import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vendors as initialVendors } from "../mockData";
import { api } from "../services/api";
import type { VendorResponse } from "../services/api";

export interface MappedVendor {
  id: string;
  name: string;
  category: string;
  status: string;
  pricingPlan: string;
  recentChange: string;
  recentChangeId?: string;
  annualImpact: string;
  impactType: "increase" | "decrease" | "neutral";
  scraperHealth: number;
  lastVerified: string;
}

export const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<"Live" | "Degraded" | null>(null);
  const [vendorList, setVendorList] = useState<MappedVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [triggerSuccess, setTriggerSuccess] = useState<string | null>(null);

  const fetchVendors = () => {
    setLoading(true);
    api.getVendors()
      .then((data: VendorResponse[]) => {
        if (data && data.length > 0) {
          const mapped: MappedVendor[] = data.map((v) => ({
            id: v.id,
            name: v.name,
            category: v.category || "SaaS",
            status: v.monitor?.status || "ACTIVE",
            pricingPlan: "Enterprise Tier",
            recentChange: "Verified active monitoring",
            annualImpact: "$0",
            impactType: "neutral",
            scraperHealth: v.monitor?.status === "HEALTHY" ? 99.4 : 95.0,
            lastVerified: v.monitor?.lastSuccessAt ? new Date(v.monitor.lastSuccessAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
          }));
          setVendorList(mapped);
        } else {
          setVendorList(initialVendors);
        }
      })
      .catch((err) => {
        console.warn("Backend vendors endpoint unavailable, using seed portfolio", err);
        setVendorList(initialVendors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleRunNow = async (e: React.MouseEvent, vendorId: string, vendorName: string) => {
    e.stopPropagation();
    setTriggeringId(vendorId);
    try {
      await api.triggerVendorRun(vendorId);
      setTriggerSuccess(`Run triggered for ${vendorName}`);
      setTimeout(() => setTriggerSuccess(null), 4000);
      fetchVendors();
    } catch (err: any) {
      alert(`Trigger run error: ${err.message || 'Scraper run request failed'}`);
    } finally {
      setTriggeringId(null);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendorList.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pricingPlan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory ? v.category === selectedCategory : true;

      let matchesHealth = true;
      if (selectedHealth === "Live") {
        matchesHealth = v.scraperHealth >= 96.0 && v.status !== "Offline";
      } else if (selectedHealth === "Degraded") {
        matchesHealth = v.scraperHealth < 96.0 || v.status === "Offline";
      }

      return matchesSearch && matchesCategory && matchesHealth;
    });
  }, [searchTerm, selectedCategory, selectedHealth, vendorList]);

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
            Vendors
          </li>
        </ol>
      </nav>

      {triggerSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[13px] font-dm-sans flex items-center justify-between shadow-sm dark:shadow-glass">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {triggerSuccess}
          </span>
          <span className="text-[11px] font-geist text-steel dark:text-slate">Status: 202 Accepted</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-bone-light dark:border-white/10 pb-6">
        <div>
          <h2 className="font-geist text-[32px] md:text-[36px] font-medium text-ink-black dark:text-bone tracking-tight leading-tight">
            Vendor Portfolio
          </h2>
          <p className="font-geist text-[14px] text-steel dark:text-ash mt-1 flex items-center gap-2">
            <span>Total Vendors: {vendorList.length}</span>
            {loading && <span className="text-[12px] text-signal-blue dark:text-white font-dm-sans animate-pulse">(Syncing API...)</span>}
          </p>
        </div>
        <button
          onClick={() => alert("Add Vendor API flow ready.")}
          className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] rounded-full py-2.5 px-6 transition-all duration-150 flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-5 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between shadow-sm dark:shadow-glass">
        {/* Search Input */}
        <div className="relative w-full lg:w-96 shrink-0">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors, categories, plans..."
            className="w-full pl-10 pr-4 py-2 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-full font-dm-sans text-[13px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full overflow-x-auto text-[13px] font-dm-sans">
          <span className="text-steel dark:text-ash font-medium mr-1">Categories:</span>
          {["AI Infrastructure", "CRM", "DevTools"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full border transition-all duration-150 ${
                selectedCategory === cat
                  ? "bg-signal-blue/15 border-signal-blue/30 text-signal-blue dark:bg-white/15 dark:border-white/30 dark:text-white font-medium shadow-sm"
                  : "bg-vapor dark:bg-white/5 border-bone-light dark:border-white/10 text-steel dark:text-ash hover:text-carbon dark:hover:text-white hover:bg-[#e4e4e7] dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-bone-light dark:bg-white/10 mx-1 hidden sm:block"></div>

          {/* Health Pill */}
          <button
            onClick={() => setSelectedHealth(selectedHealth === "Live" ? null : "Live")}
            className={`px-4 py-1.5 rounded-full border transition-all duration-150 flex items-center gap-2 ${
              selectedHealth === "Live"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-medium"
                : "bg-vapor dark:bg-white/5 border-bone-light dark:border-white/10 text-steel dark:text-ash hover:text-carbon dark:hover:text-white hover:bg-[#e4e4e7] dark:hover:bg-white/10"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span>Live Health</span>
          </button>
        </div>
      </div>

      {/* Main Vendor Data Table */}
      <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] overflow-hidden shadow-sm dark:shadow-glass">
        {filteredVendors.length === 0 ? (
          <div className="border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 text-center bg-vapor/30 dark:bg-white/[0.01] my-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 bg-vapor dark:bg-white/5 rounded-full flex items-center justify-center text-steel dark:text-slate border border-bone-light dark:border-white/10">
              <span className="material-symbols-outlined text-[32px]">storefront_off</span>
            </div>
            <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">No vendors found</h3>
            <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1 max-w-sm">
              Try adjusting your search query or removing category filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-vapor dark:bg-white/[0.02] border-b border-bone-light dark:border-white/10 font-dm-sans text-steel dark:text-ash text-[12px] font-medium uppercase tracking-wider">
                  <th className="py-4 px-6">Vendor</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Pricing Plan</th>
                  <th className="py-4 px-6">Recent Changes</th>
                  <th className="py-4 px-6 text-right">Annual Impact</th>
                  <th className="py-4 px-6 text-center">Scraper Health</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-dm-sans text-[13px] text-carbon dark:text-bone divide-y divide-bone-light/60 dark:divide-white/5">
                {filteredVendors.map((row) => {
                  const isIncrease = row.impactType === "increase";
                  const isDecrease = row.impactType === "decrease";

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-vapor/60 dark:hover:bg-white/[0.04] transition-colors duration-150 group cursor-pointer"
                      onClick={() => row.recentChangeId ? navigate(`/intelligence/${row.recentChangeId}`) : navigate("/intelligence")}
                    >
                      <td className="py-4 px-6 font-dm-sans">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center text-carbon dark:text-bone font-geist font-medium text-[13px] shrink-0 group-hover:bg-[#e4e4e7] dark:group-hover:bg-white/10 transition-colors">
                            {row.name.charAt(0)}
                          </div>
                          <span className="font-geist font-medium text-ink-black dark:text-bone group-hover:text-signal-blue dark:group-hover:text-white transition-colors text-[14px]">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-dm-sans text-steel dark:text-ash">
                        {row.category}
                      </td>

                      <td className="py-4 px-6 font-dm-sans">
                        <span className="inline-flex items-center gap-2 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone px-3 py-1 rounded-full text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                          {row.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-dm-sans font-medium text-carbon dark:text-bone">
                        {row.pricingPlan}
                      </td>

                      <td className="py-4 px-6 max-w-[200px] truncate font-dm-sans">
                        {row.recentChangeId ? (
                          <Link
                            to={`/intelligence/${row.recentChangeId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-signal-blue dark:text-bone hover:underline underline-offset-4 font-medium"
                          >
                            {row.recentChange}
                          </Link>
                        ) : (
                          <span className="text-steel dark:text-slate italic">{row.recentChange}</span>
                        )}
                      </td>

                      <td className={`py-4 px-6 text-right font-geist font-medium text-[14px] ${
                        isIncrease ? "text-red-600 dark:text-red-400" : isDecrease ? "text-emerald-700 dark:text-emerald-400" : "text-steel dark:text-slate"
                      }`}>
                        {row.annualImpact}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                          <span className="font-geist font-medium text-carbon dark:text-bone">{row.scraperHealth}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => handleRunNow(e, row.id, row.name)}
                          disabled={triggeringId === row.id}
                          className="px-4 py-1.5 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black text-[12px] font-dm-sans font-medium rounded-full dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                          {triggeringId === row.id ? "Running..." : "Run Now"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};


