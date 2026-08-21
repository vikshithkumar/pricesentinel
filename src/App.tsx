import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SubHeader } from "./components/SubHeader";
import { Dashboard } from "./components/Dashboard";
import { Vendors } from "./components/Vendors";
import { Changes } from "./components/Changes";
import { ChangeDetails } from "./components/ChangeDetails";
import { FinancialImpactDetail } from "./components/FinancialImpactDetail";
import { ScraperHealth } from "./components/ScraperHealth";
import { SelfHealingLab } from "./components/SelfHealingLab";
import { SelfHealingSuccess } from "./components/SelfHealingSuccess";
import { Watchlists } from "./components/Watchlists";
import { Reports } from "./components/Reports";
import { ReportConfigure } from "./components/ReportConfigure";
import { ReportDetail } from "./components/ReportDetail";
import { Alerts } from "./components/Alerts";
import { Settings } from "./components/Settings";

const AppContent: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState<boolean>(false);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-frost text-carbon dark:bg-[#0a0a0a] dark:text-bone font-dm-sans transition-colors duration-200">
      {/* Sidebar Shell */}
      <Sidebar
        currentPath={location.pathname}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 md:ml-[264px] flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Sub-Header greeting & time periods */}
        <SubHeader />

        {/* Main Routed canvas */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/intelligence" element={<Changes />} />
          <Route path="/intelligence/:id" element={<ChangeDetails />} />
          <Route path="/intelligence/financial-impact" element={<FinancialImpactDetail />} />
          <Route path="/scrapers" element={<ScraperHealth />} />
          <Route path="/scrapers/self-healing" element={<SelfHealingLab />} />
          <Route path="/scrapers/self-healing/success" element={<SelfHealingSuccess />} />
          <Route path="/watchlists" element={<Watchlists />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/configure" element={<ReportConfigure />} />
          <Route path="/reports/detail/:id" element={<ReportDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />

          {/* Placeholders for unfinished areas */}
          <Route
            path="*"
            element={
              <main className="flex-1 p-8 bg-frost dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-center font-dm-sans">
                <div className="w-16 h-16 rounded-full bg-white border border-bone-light dark:bg-white/5 dark:border-white/10 flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-[32px] text-steel dark:text-ash">
                    construction
                  </span>
                </div>
                <h3 className="font-geist text-[24px] text-ink-black dark:text-bone font-medium">
                  Under Construction
                </h3>
                <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-2 max-w-sm">
                  This section will be implemented in a future update.
                </p>
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};
export default App;


