import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpenMobile = false, onCloseMobile }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: "dashboard", href: "/", active: currentPath === "/" },
    { label: "Vendors", icon: "storefront", href: "/vendors", active: currentPath === "/vendors" },
    { label: "Intelligence", icon: "analytics", href: "/intelligence", active: currentPath === "/intelligence" || (currentPath.startsWith("/intelligence/") && !currentPath.startsWith("/intelligence/financial-impact")) },
    { label: "Analysis", icon: "monitoring", href: "/intelligence/financial-impact", active: currentPath.startsWith("/intelligence/financial-impact") },
    { label: "Scrapers", icon: "precision_manufacturing", href: "/scrapers", active: currentPath.startsWith("/scrapers") },
    { label: "Watchlists", icon: "visibility", href: "/watchlists", active: currentPath.startsWith("/watchlists") },
    { label: "Reports", icon: "assessment", href: "/reports", active: currentPath.startsWith("/reports") },
    { label: "Alerts", icon: "notifications_active", href: "/alerts", active: currentPath.startsWith("/alerts"), badge: 14 },
  ];

  const bottomItems = [
    { label: "Settings", icon: "settings", href: "/settings", active: currentPath.startsWith("/settings") },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-5 px-4 font-dm-sans">
      {/* Mobile Close Button */}
      {onCloseMobile && (
        <div className="md:hidden flex justify-end pb-2">
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close Mobile Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Brand Mark */}
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-[8px] bg-signal-blue dark:bg-white text-white dark:text-black flex items-center justify-center font-geist font-semibold text-[16px] shadow-sm">
          P
        </div>
        <div>
          <h1 className="font-geist text-[18px] leading-tight font-medium text-ink-black dark:text-bone tracking-tight">
            PriceSentinel
          </h1>
        </div>
      </div>

      {/* Primary Pill CTA */}
      <div className="px-1 mb-6">
        <button
          onClick={() => {
            navigate("/intelligence/financial-impact");
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-[#ededed] dark:text-black py-2.5 px-4 rounded-full font-dm-sans font-medium text-[14px] transition-all duration-150 shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-white dark:text-black group-hover:rotate-90 transition-transform duration-200">add</span>
          New Analysis
        </button>
      </div>

      {/* Nav Items */}
      <ul className="flex flex-col gap-1.5 flex-grow">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-full transition-all duration-150 ${
                item.active
                  ? "bg-signal-blue/10 text-signal-blue border border-signal-blue/20 font-medium dark:bg-white/10 dark:text-white dark:border-white/15 shadow-sm"
                  : "text-steel dark:text-ash hover:text-carbon dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={{ fontVariationSettings: item.active ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-dm-sans text-[14px] flex-grow">{item.label}</span>
              {item.badge && (
                <span className="bg-signal-blue/15 text-signal-blue dark:bg-white/15 dark:text-white text-[11px] font-geist font-medium px-2 py-0.5 rounded-full border border-signal-blue/20 dark:border-white/20 shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Nav */}
      <div className="mt-auto border-t border-bone-light dark:border-white/10 pt-3">
        <ul className="flex flex-col gap-1.5">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-full transition-all duration-150 ${
                  item.active
                    ? "bg-signal-blue/10 text-signal-blue border border-signal-blue/20 font-medium dark:bg-white/10 dark:text-white dark:border-white/15"
                    : "text-steel dark:text-ash hover:text-carbon dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                <span className="font-dm-sans text-[14px]">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Frosted Sidebar */}
      <nav className="hidden md:flex h-[calc(100vh-2rem)] w-60 fixed left-4 top-4 bg-white/90 backdrop-blur-xl border border-bone-light dark:bg-[#161616]/90 dark:border-white/10 rounded-[24px] flex-col z-40 shadow-sm dark:shadow-glass transition-colors duration-200">
        {sidebarContent}
      </nav>

      {/* Mobile Floating Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex p-3">
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <nav className="relative w-64 max-w-[80vw] h-full bg-white/95 dark:bg-[#161616]/95 border border-bone-light dark:border-white/15 rounded-[24px] shadow-2xl z-50 backdrop-blur-2xl">
            {sidebarContent}
          </nav>
        </div>
      )}
    </>
  );
};




