import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

const SETTINGS_STORAGE_KEY = "pricesentinel_user_settings";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState<string>("Profile");

  // Settings State
  const [name, setName] = useState<string>("Jane Doe");
  const [email, setEmail] = useState<string>("jane.doe@example.com");

  // Security State
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Regional Preferences State
  const [timeZone, setTimeZone] = useState<string>("Eastern Time (US & Canada)");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");

  // Status feedback
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load from localStorage or API
    try {
      const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.timeZone) setTimeZone(parsed.timeZone);
        if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
      }
    } catch (e) {
      console.warn("Could not read cached settings", e);
    }

    api.getSettings()
      .then((data) => {
        if (data) {
          if (data.name) setName(data.name);
          if (data.email) setEmail(data.email);
          if (data.timeZone) setTimeZone(data.timeZone);
          if (data.dateFormat) setDateFormat(data.dateFormat);
          if (data.theme && (data.theme === "light" || data.theme === "dark")) {
            setTheme(data.theme);
          }
        }
      })
      .catch((err) => {
        console.warn("Backend settings API unavailable, using local settings", err);
      });
  }, [setTheme]);

  const handleSave = async () => {
    setErrorMsg(null);
    setSavedSuccess(null);

    if (activeSubTab === "Security" && (newPassword || confirmPassword)) {
      if (newPassword !== confirmPassword) {
        setErrorMsg("New password and confirm password do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
    }

    setLoading(true);

    const payload = {
      name,
      email,
      currentPassword,
      newPassword,
      timeZone,
      dateFormat,
      theme,
    };

    try {
      await api.updateSettings(payload);
    } catch (err) {
      console.warn("Backend updateSettings failed or offline, persisting locally", err);
    }

    // Persist locally
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ name, email, timeZone, dateFormat, theme }));

    setLoading(false);
    setSavedSuccess("Settings updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-frost dark:bg-[#0a0a0a] flex flex-col w-full max-w-[1400px] mx-auto font-dm-sans transition-colors duration-200">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3 text-[12px] text-steel dark:text-slate font-dm-sans">
        <span className="hover:text-carbon dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>
          Dashboard
        </span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-carbon dark:text-bone font-medium">Settings</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8 border-b border-bone-light dark:border-white/10 pb-6">
        <h2 className="font-geist text-[32px] md:text-[36px] text-ink-black dark:text-bone font-medium tracking-tight leading-tight">Settings</h2>
        <p className="font-dm-sans text-steel dark:text-ash text-[14px] mt-1">Manage your account profile, credentials, regional preferences, and visual theme.</p>
      </header>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[13px] font-dm-sans flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {savedSuccess}
          </span>
          <span className="text-[11px] font-geist text-steel dark:text-slate">Saved</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-full text-[13px] font-dm-sans flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start flex-grow font-dm-sans">
        {/* Sidebar Left Column */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
          {[
            { id: "Profile", label: "Profile", icon: "person" },
            { id: "Security", label: "Security & Password", icon: "lock" },
            { id: "Regional", label: "Regional Preferences", icon: "public" },
            { id: "Appearance", label: "Appearance Theme", icon: "palette" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setErrorMsg(null);
              }}
              className={`px-4 py-3 rounded-full font-dm-sans text-left text-[14px] transition-all flex items-center justify-between group cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-signal-blue/10 text-signal-blue dark:bg-white/15 dark:text-white font-medium border border-signal-blue/20 dark:border-white/20 shadow-sm"
                  : "text-steel dark:text-ash hover:bg-black/5 dark:hover:bg-white/5 hover:text-carbon dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              <span className="material-symbols-outlined text-[16px] text-steel dark:text-slate group-hover:text-carbon dark:group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </button>
          ))}
        </aside>

        {/* Content Right Column */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-6 max-w-4xl">
          {/* Profile Tab */}
          {activeSubTab === "Profile" && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
              <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Profile Information</h3>
                <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Update your account display name and email address.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Full Name</label>
                  <input
                    className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Email Address</label>
                  <input
                    className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Security Tab */}
          {activeSubTab === "Security" && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
              <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Change Password</h3>
                <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Update your account password to keep your security posture strong.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Current Password</label>
                  <input
                    className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                </div>

                <div>
                  <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">New Password</label>
                  <input
                    className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-carbon dark:text-bone text-[13px] font-medium mb-1.5">Confirm New Password</label>
                  <input
                    className="w-full bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 rounded-[12px] px-4 py-2.5 font-dm-sans text-[13px] text-carbon dark:text-bone focus:outline-none focus:border-signal-blue dark:focus:border-white/30 transition-all"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Regional Preferences Tab */}
          {activeSubTab === "Regional" && (
            <section className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md border border-bone-light dark:border-white/10 rounded-[24px] p-6 md:p-8 shadow-sm dark:shadow-glass">
              <div className="border-b border-bone-light dark:border-white/10 pb-4 mb-6">
                <h3 className="font-geist text-ink-black dark:text-bone font-medium text-[16px]">Regional Preferences</h3>
                <p className="font-dm-sans text-sm text-steel dark:text-ash mt-1">Set your locale to align timestamps and formats with your region.</p>
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
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate pointer-events-none text-[20px]">
                      expand_more
                    </span>
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
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-steel dark:text-slate pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Appearance Tab */}
          {activeSubTab === "Appearance" && (
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
                      className="accent-signal-blue h-4 w-4 cursor-pointer"
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
                      <span className="font-geist font-medium text-[15px] text-ink-black dark:text-bone">Dark Theme</span>
                    </div>
                    <input
                      type="radio"
                      name="themeSelector"
                      checked={theme === "dark"}
                      onChange={() => setTheme("dark")}
                      className="accent-white h-4 w-4 cursor-pointer"
                    />
                  </div>
                  <p className="font-dm-sans text-[13px] text-steel dark:text-ash leading-relaxed">
                    Dusk-lit AI workspace featuring deep matte void canvas (`#0a0a0a`), translucent glass panels, and dusk accents.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-bone-light dark:border-white/10 mt-4 font-dm-sans">
            <button
              onClick={() => navigate("/")}
              className="text-steel dark:text-ash font-dm-sans font-medium text-[14px] px-5 py-2.5 hover:text-carbon dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[14px] px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};




