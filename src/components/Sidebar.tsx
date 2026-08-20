import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpenMobile = false, onCloseMobile }) => {
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
    <div className="flex flex-col h-full py-6 px-4">
      {/* Mobile Close Button */}
      {onCloseMobile && (
        <div className="md:hidden flex justify-end pb-2">
          <button
            onClick={onCloseMobile}
            className="p-1 text-[#6b7280] hover:text-[#020520] transition-colors rounded-full"
            aria-label="Close Mobile Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Relate Brand Logo Mark */}
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#145aff] flex items-center justify-center text-white font-inter font-bold text-[18px] shadow-sm">
          p
        </div>
        <div>
          <h1 className="font-inter text-[20px] leading-none font-semibold text-[#020520] tracking-[-0.16px]">
            PriceSentinel
          </h1>
          <p className="font-mono text-[11px] text-[#6b7280] mt-0.5">
            v2.4.1 Enterprise
          </p>
        </div>
      </div>

      {/* Ghost Outline CTA Button */}
      <div className="px-1 mb-6">
        <button className="w-full bg-[#fcfcfc] border border-[#145aff] text-[#145aff] hover:bg-[#f0f4fe] py-2 px-4 rounded-full font-inter font-medium text-[14px] transition-colors duration-150 shadow-sm flex items-center justify-center gap-2">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-150 ${item.active
                  ? "bg-[#f0f4fe] text-[#145aff] font-medium"
                  : "text-[#374151] hover:text-[#145aff] hover:bg-[#f0f4fe]/60"
                }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: item.active ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="font-inter text-[15px] flex-grow">{item.label}</span>
              {item.badge && (
                <span className="bg-[#f26052] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Nav Items */}
      <div className="mt-auto border-t border-[#e2e8f0] pt-3">
        <ul className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-150 ${item.active
                    ? "bg-[#f0f4fe] text-[#145aff] font-medium"
                    : "text-[#374151] hover:text-[#145aff] hover:bg-[#f0f4fe]/60"
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-inter text-[15px]">{item.label}</span>
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
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-[#e2e8f0] bg-[#ffffff] flex-col z-40">
        {sidebarContent}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#020520]/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <nav className="relative w-64 max-w-[80vw] h-full bg-[#ffffff] border-r border-[#e2e8f0] shadow-xl z-50">
            {sidebarContent}
          </nav>
        </div>
      )}
    </>
  );
};


