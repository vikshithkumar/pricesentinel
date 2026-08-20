import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpenMobile = false, onCloseMobile }) => {
  // Navigation items from the canonical Stitch screen (Executive Connected)
  const navItems = [
    { label: "Dashboard", icon: "dashboard", href: "/", active: currentPath === "/" },
    { label: "Vendors", icon: "storefront", href: "/vendors", active: currentPath === "/vendors" },
    { label: "Intelligence", icon: "analytics", href: "/intelligence", active: currentPath.startsWith("/intelligence") },
    { label: "Scrapers", icon: "precision_manufacturing", href: "/scrapers", active: currentPath.startsWith("/scrapers") },
    { label: "Watchlists", icon: "visibility", href: "/watchlists", active: currentPath.startsWith("/watchlists") },
    { label: "Reports", icon: "assessment", href: "/reports", active: currentPath.startsWith("/reports") },
    { label: "Alerts", icon: "notifications_active", href: "/alerts", active: currentPath.startsWith("/alerts"), badge: 14 },
  ];

  const bottomItems = [
    { label: "Settings", icon: "settings", href: "/settings", active: currentPath.startsWith("/settings") },
    { label: "Support", icon: "help", href: "/support", active: currentPath.startsWith("/support") },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-xl px-sm">
      {/* Mobile Close Button */}
      {onCloseMobile && (
        <div className="md:hidden flex justify-end pb-sm">
          <button
            onClick={onCloseMobile}
            className="p-1 text-secondary hover:text-ink transition-colors rounded-full"
            aria-label="Close Mobile Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Branding */}
      <div className="mb-lg px-xs">
        <h1 className="font-display-md text-[24px] leading-tight font-bold text-ink dark:text-canvas-white tracking-tight">
          PriceSentinel
        </h1>
        <p className="font-data-tabular text-data-tabular text-secondary mt-1">
          v2.4.1 Enterprise
        </p>
      </div>

      {/* CTA Button */}
      <div className="px-xs mb-xl">
        <button className="w-full bg-primary text-on-primary py-2 px-md rounded-lg font-body-strong text-[14px] hover:bg-surface-tint transition-colors shadow-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Analysis
        </button>
      </div>

      {/* Main Nav Items */}
      <ul className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-sm px-3 py-2 rounded-lg transition-colors ${item.active
                  ? "bg-surface-container-high dark:bg-on-secondary-fixed-variant text-primary dark:text-primary-fixed font-medium border-l-2 border-primary"
                  : "text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant"
                }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: item.active ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-nav-link text-[14px] flex-grow">{item.label}</span>
              {item.badge && (
                <span className="bg-critical-red text-canvas-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Nav Items */}
      <div className="mt-auto border-t border-hairline pt-sm">
        <ul className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-sm px-3 py-2 rounded-lg transition-colors ${item.active
                    ? "bg-surface-container-high dark:bg-on-secondary-fixed-variant text-primary dark:text-primary-fixed font-medium border-l-2 border-primary"
                    : "text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant"
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-nav-link text-[14px]">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-hairline dark:border-outline-variant bg-canvas-parchment dark:bg-inverse-surface flex-col z-40">
        {sidebarContent}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <nav className="relative w-64 max-w-[80vw] h-full bg-canvas-parchment dark:bg-inverse-surface border-r border-hairline shadow-xl z-50">
            {sidebarContent}
          </nav>
        </div>
      )}
    </>
  );
};

