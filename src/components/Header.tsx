import React from "react";
import { workspaceInfo } from "../mockData";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  return (
    <header className="docked full-width top-0 sticky z-30 border-b border-hairline dark:border-outline-variant bg-canvas-white/90 dark:bg-inverse-surface/90 backdrop-blur-md flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop shrink-0">
      {/* Workspace Selector & Search */}
      <div className="flex items-center gap-sm md:gap-gutter">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-secondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container"
          aria-label="Toggle Mobile Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Workspace Dropdown */}
        <div className="flex items-center gap-2 bg-surface-container rounded-md px-2 py-1 cursor-pointer hover:bg-surface-container-high transition-colors">
          <div className="w-6 h-6 bg-primary rounded text-canvas-white flex items-center justify-center font-bold text-[12px]">
            {workspaceInfo.workspaceCode}
          </div>
          <span className="font-body-strong text-[14px] text-ink hidden sm:inline">{workspaceInfo.workspaceName}</span>
          <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">
            search
          </span>
          <input
            className="pl-10 pr-sm py-1.5 rounded-full border border-hairline bg-canvas-parchment focus:bg-canvas-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body text-[14px] w-36 sm:w-48 lg:w-64 transition-all"
            placeholder="Search vendors, SKUs..."
            type="text"
          />
        </div>
      </div>

      {/* Top Navigation Links & Actions */}
      <div className="flex items-center gap-sm">
        <nav className="hidden lg:flex gap-lg mr-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant font-medium text-[14px] hover:text-primary dark:hover:text-primary-fixed transition-colors"
          >
            Market Overview
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant font-medium text-[14px] hover:text-primary dark:hover:text-primary-fixed transition-colors"
          >
            Competitors
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant dark:text-on-secondary-fixed-variant font-medium text-[14px] hover:text-primary dark:hover:text-primary-fixed transition-colors"
          >
            Global Feeds
          </a>
        </nav>

        {/* Action Buttons */}
        <button className="text-secondary hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">history</span>
        </button>
        <button className="text-secondary hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical-red rounded-full border border-canvas-white"></span>
        </button>

        {/* User Profile Avatar */}
        <img
          alt="Analyst Profile"
          className="w-8 h-8 rounded-full object-cover border border-hairline ml-2 cursor-pointer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuG0N8vPaKgsuUwe4BF397h2SOJvECwusBsLOs-gHvQyiMLviMbfEWOYd2nVQekdsqb4zPz-NMBRjXjLTFFLo7hDYKj7r_OQlxQujKhVMN7cdWlK_sTzdkkY3S5qCoC8MAlnOYg5hGBhhEymApRH82yKM1BhjQs91oCTvvVtGsLKU2yIG3t6QA-QEn0MOCA8Wa1OjZin4HorCiUsm2AGfy4Qu1ANEhtTzOfdP_QbGLSvvjveo-zOv2"
        />
      </div>
    </header>
  );
};

