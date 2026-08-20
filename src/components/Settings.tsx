import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<string>("General");
  const [firstName, setFirstName] = useState<string>("Jane");
  const [lastName, setLastName] = useState<string>("Doe");
  const [timeZone, setTimeZone] = useState<string>("Eastern Time (US & Canada)");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");
  const [tfaEnabled, setTfaEnabled] = useState<boolean>(false);

  // Notifications toggles state
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
    console.log("Saving changes:", { firstName, lastName, timeZone, dateFormat, tfaEnabled, notifs });
    alert("Settings saved successfully.");
  };

  return (
    <main className="flex-grow p-margin-mobile md:p-margin-desktop overflow-y-auto bg-background flex flex-col">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xxs mb-sm font-nav-link text-[11px] uppercase tracking-widest text-secondary">
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
        <span className="text-ink">Settings</span>
      </nav>

      {/* Page Header */}
      <header className="mb-lg">
        <h2 className="font-display-md text-display-md text-ink font-bold">Settings</h2>
        <p className="font-body text-secondary text-[14px] mt-xs">Manage your account settings and administrative preferences.</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter items-start flex-grow">

        {/* Sidebar Left Column */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-xxs">
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
              className={`px-sm py-2 rounded-lg font-body text-left text-[14px] transition-colors flex items-center justify-between group ${activeSubTab === tab
                  ? "bg-surface-container-high text-ink font-body-strong font-semibold border-r-2 border-primary"
                  : "text-secondary hover:bg-surface-container-low hover:text-ink"
                }`}
            >
              <span>{tab}</span>
              <span className="material-symbols-outlined text-[16px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </button>
          ))}
        </aside>

        {/* Content Right Column */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-lg max-w-4xl">

          {activeSubTab === "General" && (
            <>
              {/* Profile section */}
              <section className="bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm">
                <div className="border-b border-hairline pb-md mb-lg">
                  <h3 className="font-body-strong text-ink font-semibold text-[15px]">Profile Information</h3>
                  <p className="font-body text-sm text-secondary mt-xxs">Update your personal details and how others see you on the platform.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-xl mb-lg">
                  <div className="relative group cursor-pointer shrink-0">
                    <img
                      className="w-20 h-20 rounded-full object-cover border border-hairline group-hover:opacity-80 transition-opacity"
                      alt="User Profile"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH5fFoGn_PeqjzU0bYiMAeR09iJ_hl5pRhnn63tD1_zdIeMQhvTPbIhawfU_sW1ZhavEcUa87IDT1_jIXCZQ39rwn_1ENkh2ov1SJckThpdWkmdmOqz1KenSrV-Mo8OUd8kTYdqcXQLBw-zUSCJu2BAj73NF0IEn2H2FLoXOAdbK64cFBI7ufI6xiLmHKQHcVf4-8YzgN_-CpA3khLEXmMM0Pw-gifTcOsIkk_-4XCQUz7CgSMgiTl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-ink bg-canvas-white/90 p-1 rounded-full backdrop-blur-sm shadow-sm text-[18px]">edit</span>
                    </div>
                  </div>

                  <div className="flex-grow grid grid-cols-2 gap-md w-full">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">First Name</label>
                      <input
                        className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 font-body text-[13px] focus:outline-none focus:border-primary transition-colors"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Last Name</label>
                      <input
                        className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 font-body text-[13px] focus:outline-none focus:border-primary transition-colors"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Email Address</label>
                      <input
                        className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 font-body text-[13px] text-secondary cursor-not-allowed"
                        disabled
                        type="email"
                        value="jane.doe@example.com"
                      />
                      <p className="font-nav-link text-[11px] text-secondary mt-1">Contact your organization administrator to change your email.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences section */}
              <section className="bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm">
                <div className="border-b border-hairline pb-md mb-lg">
                  <h3 className="font-body-strong text-ink font-semibold text-[15px]">Regional Preferences</h3>
                  <p className="font-body text-sm text-secondary mt-xxs">Set your locale to ensure data and timestamps align with your region.</p>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Time Zone</label>
                    <div className="relative">
                      <select
                        className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 pr-10 font-body text-[13px] focus:outline-none focus:border-primary transition-colors appearance-none"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                      >
                        <option>Pacific Time (US & Canada)</option>
                        <option>Eastern Time (US & Canada)</option>
                        <option>Coordinated Universal Time (UTC)</option>
                        <option>Central European Time (CET)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-label-capsule text-label-capsule text-ink mb-xxs">Date Format</label>
                    <div className="relative">
                      <select
                        className="w-full bg-surface-pearl border border-hairline rounded-sm px-sm py-2 pr-10 font-body text-[13px] focus:outline-none focus:border-primary transition-colors appearance-none"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security section */}
              <section className="bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm">
                <div className="border-b border-hairline pb-md mb-lg">
                  <h3 className="font-body-strong text-ink font-semibold text-[15px]">Security Settings</h3>
                  <p className="font-body text-sm text-secondary mt-xxs">Manage your authentication methods and active sessions.</p>
                </div>

                <div className="flex items-center justify-between py-sm border-b border-hairline">
                  <div>
                    <h4 className="font-body-strong text-ink font-semibold text-[14px]">Password</h4>
                    <p className="font-body text-sm text-secondary mt-0.5">Last changed 3 months ago.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => console.log("Mock update password")}
                    className="bg-surface-pearl border border-hairline text-ink px-md py-1.5 rounded-full font-body hover:bg-surface-container-high transition-colors text-[13px]"
                  >
                    Update Password
                  </button>
                </div>

                <div className="flex items-center justify-between py-sm pt-md">
                  <div>
                    <h4 className="font-body-strong text-ink font-semibold text-[14px]">Two-Factor Authentication (2FA)</h4>
                    <p className="font-body text-sm text-secondary mt-0.5">Add an extra layer of security to your account.</p>
                  </div>

                  {/* Switch toggle */}
                  <button
                    type="button"
                    onClick={() => setTfaEnabled(!tfaEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tfaEnabled ? "bg-primary" : "bg-surface-container-highest"
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-canvas-white transition-transform shadow-sm ${tfaEnabled ? "translate-x-6" : "translate-x-1"
                      }`}></span>
                  </button>
                </div>
              </section>
            </>
          )}

          {activeSubTab === "Notifications" && (
            <section className="bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm">
              <div className="border-b border-hairline pb-md mb-lg">
                <h3 className="font-body-strong text-ink font-semibold text-[15px]">Notification Preferences</h3>
                <p className="font-body text-sm text-secondary mt-xxs">Choose which channels you want to receive pricing intelligence alerts on.</p>
              </div>

              {/* Preferences matrix grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline bg-canvas-parchment/40">
                      <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-secondary">Alert Type</th>
                      <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-secondary text-center">Email</th>
                      <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-secondary text-center">Slack</th>
                      <th className="py-2.5 px-md font-label-capsule text-[11px] font-bold uppercase text-secondary text-center">SMS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-hairline">
                      <td className="py-4 px-md">
                        <div className="font-body-strong text-ink font-semibold text-[14px]">Critical Changes</div>
                        <p className="text-[11px] text-secondary mt-0.5">High financial variance, critical selector failures</p>
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalEmail}
                          onChange={() => handleToggleNotif("criticalEmail")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSlack}
                          onChange={() => handleToggleNotif("criticalSlack")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSms}
                          onChange={() => handleToggleNotif("criticalSms")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-hairline">
                      <td className="py-4 px-md">
                        <div className="font-body-strong text-ink font-semibold text-[14px]">Warnings & Stales</div>
                        <p className="text-[11px] text-secondary mt-0.5">Node stales, DOM adaptation triggers</p>
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningEmail}
                          onChange={() => handleToggleNotif("warningEmail")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSlack}
                          onChange={() => handleToggleNotif("warningSlack")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSms}
                          onChange={() => handleToggleNotif("warningSms")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-hairline last:border-0">
                      <td className="py-4 px-md">
                        <div className="font-body-strong text-ink font-semibold text-[14px]">Weekly Summaries</div>
                        <p className="text-[11px] text-secondary mt-0.5">Weekly executive summaries, change log lists</p>
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestEmail}
                          onChange={() => handleToggleNotif("digestEmail")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSlack}
                          onChange={() => handleToggleNotif("digestSlack")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-md text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSms}
                          onChange={() => handleToggleNotif("digestSms")}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSubTab !== "General" && activeSubTab !== "Notifications" && (
            <section className="bg-canvas-white border border-hairline rounded-lg p-xl shadow-sm text-center">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-2">construction</span>
              <h3 className="font-tagline text-[18px] text-ink font-semibold">{activeSubTab} Sub-tab</h3>
              <p className="font-body text-secondary text-[14px] mt-xs">This settings subsection is currently offline or configured by enterprise admins.</p>
            </section>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-sm pt-md border-t border-hairline mt-md">
            <button
              onClick={() => navigate("/")}
              className="text-primary font-body-strong text-[14px] px-md py-2 hover:bg-primary/5 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-on-primary font-body-strong text-[14px] px-lg py-2 rounded-full hover:scale-95 transition-transform shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};
