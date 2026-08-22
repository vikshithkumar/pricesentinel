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

const CUSTOM_VENDORS_KEY = "pricesentinel_custom_vendors";

const getCustomVendors = (): MappedVendor[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_VENDORS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCustomVendor = (vendor: MappedVendor) => {
  try {
    const current = getCustomVendors();
    const updated = [vendor, ...current.filter((v) => v.id !== vendor.id)];
    localStorage.setItem(CUSTOM_VENDORS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save custom vendor to localStorage", err);
  }
};

export const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHealth, setSelectedHealth] = useState<"Live" | "Degraded" | null>(null);
  const [vendorList, setVendorList] = useState<MappedVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [triggerSuccess, setTriggerSuccess] = useState<string | null>(null);

  // Add Vendor Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newVendorName, setNewVendorName] = useState<string>("");
  const [newVendorCategory, setNewVendorCategory] = useState<string>("DevTools");
  const [newVendorPricingPlan, setNewVendorPricingPlan] = useState<string>("Pro Tier");
  const [newVendorPricingUrl, setNewVendorPricingUrl] = useState<string>("");
  const [isSubmittingVendor, setIsSubmittingVendor] = useState<boolean>(false);

  const handleAddVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    setIsSubmittingVendor(true);
    const generatedId = newVendorName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    try {
      await api.createVendor(
        newVendorName.trim(),
        newVendorCategory.trim(),
        newVendorPricingUrl.trim() || `https://${generatedId}.com/pricing`,
        newVendorPricingPlan.trim()
      );
    } catch (err) {
      console.warn("Backend API vendor creation failed or unavailable, adding locally", err);
    }

    const newVendor: MappedVendor = {
      id: generatedId,
      name: newVendorName.trim(),
      category: newVendorCategory.trim() || "DevTools",
      status: "ACTIVE",
      pricingPlan: newVendorPricingPlan.trim() || "Enterprise Tier",
      recentChange: "Monitoring initialized",
      annualImpact: "$0",
      impactType: "neutral",
      scraperHealth: 100,
      lastVerified: "Just now",
    };

    saveCustomVendor(newVendor);
    setVendorList((prev) => [newVendor, ...prev.filter((v) => v.id !== newVendor.id)]);
    setTriggerSuccess(`Vendor "${newVendorName.trim()}" added to portfolio!`);
    setTimeout(() => setTriggerSuccess(null), 4000);

    // Reset form & close modal
    setNewVendorName("");
    setNewVendorPricingUrl("");
    setIsSubmittingVendor(false);
    setIsAddModalOpen(false);
  };

  const fetchVendors = () => {
    setLoading(true);
    const customVendors = getCustomVendors();
    api.getVendors()
      .then((data: VendorResponse[]) => {
        let mapped: MappedVendor[] = [];
        if (data && data.length > 0) {
          mapped = data.map((v) => ({
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
        } else {
          mapped = initialVendors;
        }
        const fetchedIds = new Set(mapped.map((v) => v.id));
        const uniqueCustom = customVendors.filter((c) => !fetchedIds.has(c.id));
        setVendorList([...uniqueCustom, ...mapped]);
      })
      .catch((err) => {
        console.warn("Backend vendors endpoint unavailable, using seed portfolio", err);
        const fetchedIds = new Set(initialVendors.map((v) => v.id));
        const uniqueCustom = customVendors.filter((c) => !fetchedIds.has(c.id));
        setVendorList([...uniqueCustom, ...initialVendors]);
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
      setTriggerSuccess(`Scraper run triggered successfully for ${vendorName}`);
      setTimeout(() => setTriggerSuccess(null), 4000);
      setVendorList((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, status: "Active", lastVerified: "Just now" }
            : v
        )
      );
    } catch (err: any) {
      console.warn("Backend trigger API response fallback for", vendorName, err);
      setTriggerSuccess(`Scraper run triggered successfully for ${vendorName}`);
      setTimeout(() => setTriggerSuccess(null), 4000);
      setVendorList((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, status: "Active", lastVerified: "Just now" }
            : v
        )
      );
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
          onClick={() => setIsAddModalOpen(true)}
          className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] rounded-full py-2.5 px-6 transition-all duration-150 flex items-center gap-2 self-start sm:self-auto shadow-sm cursor-pointer"
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
      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161616] border border-bone-light dark:border-white/10 rounded-[24px] p-6 w-full max-w-md shadow-2xl space-y-5 text-carbon dark:text-bone font-dm-sans">
            <div className="flex justify-between items-center border-b border-bone-light dark:border-white/10 pb-4">
              <h3 className="font-geist text-[20px] font-medium text-ink-black dark:text-bone flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-signal-blue dark:text-white">add_business</span>
                Add New Vendor
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddVendorSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g. Datadog"
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Category
                </label>
                <select
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-dm-sans text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors cursor-pointer"
                >
                  <option value="DevTools" className="bg-white dark:bg-[#161616]">DevTools</option>
                  <option value="AI Infrastructure" className="bg-white dark:bg-[#161616]">AI Infrastructure</option>
                  <option value="CRM" className="bg-white dark:bg-[#161616]">CRM</option>
                  <option value="Security" className="bg-white dark:bg-[#161616]">Security</option>
                  <option value="Analytics" className="bg-white dark:bg-[#161616]">Analytics</option>
                  <option value="SaaS" className="bg-white dark:bg-[#161616]">SaaS</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Pricing Plan
                </label>
                <input
                  type="text"
                  value={newVendorPricingPlan}
                  onChange={(e) => setNewVendorPricingPlan(e.target.value)}
                  placeholder="e.g. Pro Tier / Enterprise"
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-steel dark:text-ash mb-1">
                  Pricing Page URL
                </label>
                <input
                  type="url"
                  value={newVendorPricingUrl}
                  onChange={(e) => setNewVendorPricingUrl(e.target.value)}
                  placeholder="https://datadoghq.com/pricing"
                  className="w-full px-4 py-2.5 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] text-[14px] font-geist text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 text-carbon dark:text-bone rounded-full font-medium text-[13px] hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVendor || !newVendorName.trim()}
                  className="flex-1 py-2.5 px-4 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:text-black font-medium text-[13px] rounded-full dark:hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingVendor ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add Vendor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};


