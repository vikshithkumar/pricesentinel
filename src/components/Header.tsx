import React from "react";
import { workspaceInfo } from "../mockData";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  return (
    <header className="docked full-width top-0 sticky z-30 border-b border-[#e2e8f0] bg-[#fcfcfc]/90 backdrop-blur-md flex justify-between items-center h-16 px-4 md:px-10 shrink-0">
      {/* Workspace Selector & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-[#374151] hover:text-[#145aff] transition-colors p-1.5 rounded-full hover:bg-[#f0f4fe]"
          aria-label="Toggle Mobile Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Workspace Dropdown */}
        <div className="flex items-center gap-2 bg-[#ffffff] border border-[#e2e8f0] rounded-[12px] px-3 py-1.5 cursor-pointer hover:border-[#145aff]/40 transition-colors shadow-sm">
          <div className="w-6 h-6 bg-[#145aff] rounded-full text-white flex items-center justify-center font-bold text-[11px]">
            {workspaceInfo.workspaceCode}
          </div>
          <span className="font-inter font-medium text-[14px] text-[#020520] hidden sm:inline">{workspaceInfo.workspaceName}</span>
          <span className="material-symbols-outlined text-[16px] text-[#6b7280]">expand_more</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px]">
            search
          </span>
          <input
            className="pl-9 pr-3 py-1.5 rounded-[12px] border border-[#e2e8f0] bg-[#f1f5f9] focus:bg-[#ffffff] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] font-inter text-[14px] text-[#020520] placeholder-[#6b7280] w-36 sm:w-48 lg:w-64 transition-all"
            placeholder="Search vendors, SKUs..."
            type="text"
          />
        </div>
      </div>

      {/* Top Navigation Links & Actions */}
      <div className="flex items-center gap-3">
        <nav className="hidden lg:flex gap-6 mr-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[#374151] font-inter font-medium text-[15px] hover:text-[#145aff] transition-colors"
          >
            Market Overview
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[#374151] font-inter font-medium text-[15px] hover:text-[#145aff] transition-colors"
          >
            Competitors
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[#374151] font-inter font-medium text-[15px] hover:text-[#145aff] transition-colors"
          >
            Global Feeds
          </a>
        </nav>

        {/* Action Buttons */}
        <button className="text-[#374151] hover:text-[#145aff] transition-colors p-2 rounded-full hover:bg-[#f0f4fe]">
          <span className="material-symbols-outlined text-[20px]">history</span>
        </button>
        <button className="text-[#374151] hover:text-[#145aff] transition-colors p-2 rounded-full hover:bg-[#f0f4fe] relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f26052] rounded-full border border-white"></span>
        </button>

        {/* User Profile Avatar */}
        <img
          alt="Analyst Profile"
          className="w-8 h-8 rounded-full object-cover border border-[#e2e8f0] ml-2 cursor-pointer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuG0N8vPaKgsuUwe4BF397h2SOJvECwusBsLOs-gHvQyiMLviMbfEWOYd2nVQekdsqb4zPz-NMBRjXjLTFFLo7hDYKj7r_OQlxQujKhVMN7cdWlK_sTzdkkY3S5qCoC8MAlnOYg5hGBhhEymApRH82yKM1BhjQs91oCTvvVtGsLKU2yIG3t6QA-QEn0MOCA8Wa1OjZin4HorCiUsm2AGfy4Qu1ANEhtTzOfdP_QbGLSvvjveo-zOv2"
        />
      </div>
    </header>
  );
};


