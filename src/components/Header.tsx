import React from "react";
import { workspaceInfo } from "../mockData";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-30 mx-4 md:mx-6 my-2 bg-white/80 dark:bg-[#161616]/80 backdrop-blur-xl border border-bone-light dark:border-white/10 rounded-full px-5 py-2 flex justify-between items-center shrink-0 shadow-sm dark:shadow-glass transition-colors duration-200">
      {/* Workspace Selector & Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Toggle Mobile Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Workspace Dropdown Pill */}
        <div className="flex items-center gap-2 bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 hover:border-mist dark:hover:border-white/20 rounded-full px-3 py-1.5 cursor-pointer transition-all">
          <div className="w-5 h-5 bg-signal-blue dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-geist font-semibold text-[10px]">
            {workspaceInfo.workspaceCode}
          </div>
          <span className="font-dm-sans font-medium text-[13px] text-carbon dark:text-bone hidden sm:inline">{workspaceInfo.workspaceName}</span>
          <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate">expand_more</span>
        </div>

        {/* Global Pill Search Bar */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-steel dark:text-slate text-[16px]">
            search
          </span>
          <input
            className="pl-9 pr-4 py-1.5 rounded-full border border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:border-signal-blue dark:focus:border-white/30 font-dm-sans text-[13px] text-carbon dark:text-bone placeholder:text-steel dark:placeholder:text-slate w-36 sm:w-52 lg:w-72 transition-all"
            placeholder="Search vendors, SKUs..."
            type="text"
          />
        </div>
      </div>

      {/* Top Navigation Links & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <nav className="hidden lg:flex items-center gap-1 mr-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white font-dm-sans font-medium text-[13px] px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Market Overview
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white font-dm-sans font-medium text-[13px] px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Competitors
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white font-dm-sans font-medium text-[13px] px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Global Feeds
          </a>
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[19px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Action Buttons */}
        <button className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-[19px]">history</span>
        </button>
        <button className="text-steel dark:text-ash hover:text-carbon dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 relative">
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-signal-blue dark:bg-[#6b62f2] rounded-full ring-2 ring-white dark:ring-[#161616]"></span>
        </button>

        {/* User Profile Avatar */}
        <img
          alt="Analyst Profile"
          className="w-7 h-7 rounded-full object-cover border border-bone-light dark:border-white/20 ml-1 cursor-pointer hover:border-signal-blue dark:hover:border-white transition-colors"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuG0N8vPaKgsuUwe4BF397h2SOJvECwusBsLOs-gHvQyiMLviMbfEWOYd2nVQekdsqb4zPz-NMBRjXjLTFFLo7hDYKj7r_OQlxQujKhVMN7cdWlK_sTzdkkY3S5qCoC8MAlnOYg5hGBhhEymApRH82yKM1BhjQs91oCTvvVtGsLKU2yIG3t6QA-QEn0MOCA8Wa1OjZin4HorCiUsm2AGfy4Qu1ANEhtTzOfdP_QbGLSvvjveo-zOv2"
        />
      </div>
    </header>
  );
};




