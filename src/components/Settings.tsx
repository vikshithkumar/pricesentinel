import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<string>("General");
  const [firstName, setFirstName] = useState<string>("Jane");
  const [lastName, setLastName] = useState<string>("Doe");
  const [timeZone, setTimeZone] = useState<string>("Eastern Time (US & Canada)");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");
  const [tfaEnabled, setTfaEnabled] = useState<boolean>(false);

  const [notifs, setNotifs] = useState({
    criticalEmail: true,
    criticalSlack: true,
    criticalSms: false,
    warningEmail: false,
    warningSlack: true,
    warningSms: false,
    digestEmail: true,
    digestSlack: false,
    digestSms: false,
  });

  const handleToggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("Saving changes:", { firstName, lastName, timeZone, dateFormat, tfaEnabled, notifs, theme });
    alert("Settings saved successfully.");
  };

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3 text-[12px] text-steel dark:text-slate font-dm-sans">
        <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-carbon dark:text-bone font-medium">Settings</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8 border-b border-bone-light dark:border-white/10 pb-6">
        <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">Settings</h2>
        <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1">Manage your account settings and administrative preferences.</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start flex-grow font-dm-sans">

        {/* Sidebar Left Column */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
          {[
            "General",
            "Company Profile",
            "Monitoring",
            "Alerts",
            "Notifications",
            "Integrations",
            "Data & Privacy",
            "Team",
            "Appearance"
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2.5 rounded-full font-dm-sans text-left text-[14px] transition-all flex items-center justify-between group ${activeSubTab === tab
                  ? "bg-signal-blue/10 text-signal-blue dark:bg-white/15 dark:text-white font-medium border border-signal-blue/20 dark:border-white/20 shadow-sm"
                  : "text-steel dark:text-ash hover:bg-black/5 dark:hover:bg-white/5 hover:text-carbon dark:hover:text-white"
                }`}
            >
              <span>{tab}</span>
              <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate group-hover:text-carbon dark:group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </button>
          ))}
        </aside>

        {/* Content Right Column */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-6 max-w-4xl">

          {(activeSubTab === "General" || activeSubTab === "Appearance") && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
              <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Interface Theme</h3>
                <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Select your preferred PriceSentinel visual theme mode.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <div
                  onClick={() => setTheme("light")}
                  className={`p-5 rounded-[20px] border cursor-pointer transition-all flex flex-col gap-3 ${
                    theme === "light"
                      ? "border-signal-blue bg-frost text-carbon ring-2 ring-signal-blue/20 shadow-sm"
                      : "border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 text-steel dark:text-ash hover:border-mist dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-signal-blue">light_mode</span>
                      <span className="font-geist font-medium text-[15px] text-ink-black dark:text-bone">Light Theme</span>
                    </div>
                    <input
                      type="radio"
                      name="themeSelector"
                      checked={theme === "light"}
                      onChange={() => setTheme("light")}
                      className="accent-signal-blue h-4 w-4"
                    />
                  </div>
                  <p className="font-dm-sans text-[13px] text-steel dark:text-ash leading-relaxed">
                    Core Blue-Gray Palette with clean white surfaces, crisp carbon typography, and Signal Blue CTAs.
                  </p>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => setTheme("dark")}
                  className={`p-5 rounded-[20px] border cursor-pointer transition-all flex flex-col gap-3 ${
                    theme === "dark"
                      ? "border-white/40 bg-white/10 text-white ring-2 ring-white/20 shadow-sm"
                      : "border-bone-light dark:border-white/10 bg-vapor dark:bg-white/5 text-steel dark:text-ash hover:border-mist dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-amber-400">dark_mode</span>
                      <span className="font-geist font-medium text-[15px] text-ink-black dark:text-bone">Dark Theme (Dimension)</span>
                    </div>
                    <input
                      type="radio"
                      name="themeSelector"
                      checked={theme === "dark"}
                      onChange={() => setTheme("dark")}
                      className="accent-white h-4 w-4"
                    />
                  </div>
                  <p className="font-dm-sans text-[13px] text-steel dark:text-ash leading-relaxed">
                    Dusk-lit AI workspace featuring deep matte void canvas (`#0a0a0a`), translucent glass panels, and dusk violet accents.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSubTab === "General" && (
            <>
              {/* Profile section */}
              <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
                <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                  <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Profile Information</h3>
                  <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Update your personal details and how others see you on the platform.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <div className="relative group cursor-pointer shrink-0">
                    <img
                      className="w-20 h-20 rounded-full object-cover border border-bone-light dark:border-white/15 group-hover:opacity-80 transition-opacity"
                      alt="User Profile"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH5fFoGn_PeqjzU0bYiMAeR09iJ_hl5pRhnn63tD1_zdIeMQhvTPbIhawfU_sW1ZhavEcUa87IDT1_jIXCZQ39rwn_1ENkh2ov1SJckThpdWkmdmOqz1KenSrV-Mo8OUd8kTYdqcXQLBw-zUSCJu2BAj73NF0IEn2H2FLoXOAdbK64cFBI7ufI6xiLmHKQHcVf4-8YzgN_-CpA3khLEXmMM0Pw-gifTcOsIkk_-4XCQUz7CgSMgiTl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-carbon dark:text-bone bg-white/90 dark:bg-[#161616]/90 p-1.5 rounded-full backdrop-blur-sm shadow-sm text-[18px]">edit</span>
                    </div>
                  </div>

                  <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">First Name</label>
                      <input
                        className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Last Name</label>
                      <input
                        className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Email Address</label>
                      <input
                        className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-fog dark:text-slate cursor-not-allowed opacity-60"
                        disabled
                        type="email"
                        value="jane.doe@example.com"
                      />
                      <p className="font-geist text-[11px] text-steel dark:text-slate mt-1.5">Contact your organization administrator to change your email.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences section */}
              <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
                <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                  <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Regional Preferences</h3>
                  <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Set your locale to ensure data and timestamps align with your region.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Time Zone</label>
                    <div className="relative">
                      <select
                        className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 pr-10 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all appearance-none cursor-pointer"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                      >
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Pacific Time (US & Canada)</option>
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Eastern Time (US & Canada)</option>
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Coordinated Universal Time (UTC)</option>
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">Central European Time (CET)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Date Format</label>
                    <div className="relative">
                      <select
                        className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 pr-10 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all appearance-none cursor-pointer"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">MM/DD/YYYY</option>
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">DD/MM/YYYY</option>
                        <option className="bg-white text-carbon dark:bg-[#161616] dark:text-bone">YYYY-MM-DD</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security section */}
              <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
                <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                  <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Security Settings</h3>
                  <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Manage your authentication methods and active sessions.</p>
                </div>

                <div className="flex items-center justify-between py-3.5 border-b border-bone-light dark:border-white/10">
                  <div>
                    <h4 className="font-geist text-ink-black dark:text-bone font-medium text-[14px]">Password</h4>
                    <p className="font-dm-sans text-sm text-steel dark:text-ash mt-0.5">Last changed 3 months ago.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => console.log("Mock update password")}
                    className="bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/15 text-carbon dark:text-bone px-4 py-2 rounded-full font-dm-sans hover:bg-[#e4e4e7] dark:hover:bg-white/10 transition-colors text-[13px] font-medium"
                  >
                    Update Password
                  </button>
                </div>

                <div className="flex items-center justify-between py-3.5 pt-4">
                  <div>
                    <h4 className="font-geist text-ink-black dark:text-bone font-medium text-[14px]">Two-Factor Authentication (2FA)</h4>
                    <p className="font-dm-sans text-sm text-steel dark:text-ash mt-0.5">Add an extra layer of security to your account.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTfaEnabled(!tfaEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tfaEnabled ? "bg-signal-blue dark:bg-white" : "bg-bone-light dark:bg-white/10"
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full transition-transform shadow-sm ${tfaEnabled ? "translate-x-6 bg-white dark:bg-black" : "translate-x-1 bg-white dark:bg-ash"
                      }`}></span>
                  </button>
                </div>
              </section>
            </>
          )}

          {activeSubTab === "Notifications" && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
              <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Notification Preferences</h3>
                <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Choose which channels you want to receive pricing intelligence alerts on.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-dm-sans">
                  <thead>
                    <tr className="border-b border-bone-light dark:border-white/10 bg-vapor dark:bg-white/[0.02]">
                      <th className="py-3 px-4 font-geist text-[11px] font-medium uppercase tracking-wider text-steel dark:text-ash">Alert Type</th>
                      <th className="py-3 px-4 font-geist text-[11px] font-medium uppercase tracking-wider text-steel dark:text-ash text-center">Email</th>
                      <th className="py-3 px-4 font-geist text-[11px] font-medium uppercase tracking-wider text-steel dark:text-ash text-center">Slack</th>
                      <th className="py-3 px-4 font-geist text-[11px] font-medium uppercase tracking-wider text-steel dark:text-ash text-center">SMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone-light dark:divide-white/5 text-carbon dark:text-bone">
                    <tr>
                      <td className="py-4 px-4">
                        <div className="font-geist text-ink-black dark:text-bone font-medium text-[14px]">Critical Changes</div>
                        <p className="text-[12px] text-steel dark:text-ash mt-0.5">High financial variance, critical selector failures</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalEmail}
                          onChange={() => handleToggleNotif("criticalEmail")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSlack}
                          onChange={() => handleToggleNotif("criticalSlack")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSms}
                          onChange={() => handleToggleNotif("criticalSms")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">
                        <div className="font-geist text-ink-black dark:text-bone font-medium text-[14px]">Warnings & Stales</div>
                        <p className="text-[12px] text-steel dark:text-ash mt-0.5">Node stales, DOM adaptation triggers</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningEmail}
                          onChange={() => handleToggleNotif("warningEmail")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSlack}
                          onChange={() => handleToggleNotif("warningSlack")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSms}
                          onChange={() => handleToggleNotif("warningSms")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">
                        <div className="font-geist text-ink-black dark:text-bone font-medium text-[14px]">Weekly Summaries</div>
                        <p className="text-[12px] text-steel dark:text-ash mt-0.5">Weekly executive summaries, change log lists</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestEmail}
                          onChange={() => handleToggleNotif("digestEmail")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSlack}
                          onChange={() => handleToggleNotif("digestSlack")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSms}
                          onChange={() => handleToggleNotif("digestSms")}
                          className="rounded text-signal-blue accent-signal-blue dark:accent-white focus:ring-0 h-4 w-4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSubTab !== "General" && activeSubTab !== "Appearance" && activeSubTab !== "Notifications" && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-8 shadow-sm dark:shadow-glass text-center">
              <span className="material-symbols-outlined text-[48px] text-steel dark:text-slate mb-2">construction</span>
              <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">{activeSubTab} Sub-tab</h3>
              <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1">This settings subsection is currently offline or configured by enterprise admins.</p>
            </section>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-bone-light dark:border-white/10 mt-4 font-dm-sans">
            <button
              onClick={() => navigate("/")}
              className="text-steel dark:text-ash font-dm-sans font-medium text-[14px] px-5 py-2.5 hover:text-carbon dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] px-6 py-2.5 rounded-full transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};



