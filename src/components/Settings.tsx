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
    <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-[#fcfcfc] flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4 text-[12px] text-[#6b7280] font-inter">
        <span className="hover:text-[#145aff] cursor-pointer transition-colors" onClick={() => navigate("/")}>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#020520] font-medium">Settings</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8 border-b border-[#e2e8f0] pb-6">
        <h2 className="font-inter text-[32px] md:text-[40px] text-[#020520] font-semibold tracking-[-1.48px] leading-tight">Settings</h2>
        <p className="font-inter text-[#374151] text-[14px] mt-1">Manage your account settings and administrative preferences.</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start flex-grow font-inter">

        {/* Sidebar Left Column */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-1">
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
              className={`px-4 py-2.5 rounded-full font-inter text-left text-[14px] transition-colors duration-150 flex items-center justify-between group ${activeSubTab === tab
                  ? "bg-[#f0f4fe] text-[#145aff] font-semibold"
                  : "text-[#374151] hover:bg-[#f0f4fe]/60 hover:text-[#145aff]"
                }`}
            >
              <span>{tab}</span>
              <span className="material-symbols-outlined text-[16px] text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </button>
          ))}
        </aside>

        {/* Content Right Column */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-6 max-w-4xl">

          {activeSubTab === "General" && (
            <>
              {/* Profile section */}
              <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 md:p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
                <div className="border-b border-[#e2e8f0] pb-4 mb-6">
                  <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Profile Information</h3>
                  <p className="font-inter text-sm text-[#374151] mt-1">Update your personal details and how others see you on the platform.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <div className="relative group cursor-pointer shrink-0">
                    <img
                      className="w-20 h-20 rounded-full object-cover border border-[#e2e8f0] group-hover:opacity-80 transition-opacity"
                      alt="User Profile"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH5fFoGn_PeqjzU0bYiMAeR09iJ_hl5pRhnn63tD1_zdIeMQhvTPbIhawfU_sW1ZhavEcUa87IDT1_jIXCZQ39rwn_1ENkh2ov1SJckThpdWkmdmOqz1KenSrV-Mo8OUd8kTYdqcXQLBw-zUSCJu2BAj73NF0IEn2H2FLoXOAdbK64cFBI7ufI6xiLmHKQHcVf4-8YzgN_-CpA3khLEXmMM0Pw-gifTcOsIkk_-4XCQUz7CgSMgiTl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[#020520] bg-[#ffffff]/90 p-1 rounded-full backdrop-blur-sm shadow-sm text-[18px]">edit</span>
                    </div>
                  </div>

                  <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[#020520] text-[13px] font-medium mb-1">First Name</label>
                      <input
                        className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 font-inter text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[#020520] text-[13px] font-medium mb-1">Last Name</label>
                      <input
                        className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 font-inter text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[#020520] text-[13px] font-medium mb-1">Email Address</label>
                      <input
                        className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 font-inter text-[13px] text-[#6b7280] cursor-not-allowed"
                        disabled
                        type="email"
                        value="jane.doe@example.com"
                      />
                      <p className="font-mono text-[11px] text-[#6b7280] mt-1">Contact your organization administrator to change your email.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences section */}
              <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 md:p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
                <div className="border-b border-[#e2e8f0] pb-4 mb-6">
                  <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Regional Preferences</h3>
                  <p className="font-inter text-sm text-[#374151] mt-1">Set your locale to ensure data and timestamps align with your region.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[#020520] text-[13px] font-medium mb-1">Time Zone</label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 pr-10 font-inter text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all appearance-none cursor-pointer"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                      >
                        <option>Pacific Time (US & Canada)</option>
                        <option>Eastern Time (US & Canada)</option>
                        <option>Coordinated Universal Time (UTC)</option>
                        <option>Central European Time (CET)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[#020520] text-[13px] font-medium mb-1">Date Format</label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#f1f5f9] border border-[#e2e8f0] rounded-[12px] px-3 py-2 pr-10 font-inter text-[13px] text-[#020520] focus:outline-none focus:border-[#145aff] focus:ring-1 focus:ring-[#0099ff] transition-all appearance-none cursor-pointer"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security section */}
              <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 md:p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
                <div className="border-b border-[#e2e8f0] pb-4 mb-6">
                  <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Security Settings</h3>
                  <p className="font-inter text-sm text-[#374151] mt-1">Manage your authentication methods and active sessions.</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#e2e8f0]">
                  <div>
                    <h4 className="font-inter text-[#020520] font-semibold text-[14px]">Password</h4>
                    <p className="font-inter text-sm text-[#6b7280] mt-0.5">Last changed 3 months ago.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => console.log("Mock update password")}
                    className="bg-[#ffffff] border border-[#e2e8f0] text-[#020520] px-4 py-1.5 rounded-full font-inter hover:bg-[#f0f4fe] transition-colors duration-150 text-[13px] font-medium"
                  >
                    Update Password
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 pt-4">
                  <div>
                    <h4 className="font-inter text-[#020520] font-semibold text-[14px]">Two-Factor Authentication (2FA)</h4>
                    <p className="font-inter text-sm text-[#6b7280] mt-0.5">Add an extra layer of security to your account.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTfaEnabled(!tfaEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tfaEnabled ? "bg-[#145aff]" : "bg-[#e2e8f0]"
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${tfaEnabled ? "translate-x-6" : "translate-x-1"
                      }`}></span>
                  </button>
                </div>
              </section>
            </>
          )}

          {activeSubTab === "Notifications" && (
            <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-6 md:p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px]">
              <div className="border-b border-[#e2e8f0] pb-4 mb-6">
                <h3 className="font-inter text-[#020520] font-semibold text-[15px]">Notification Preferences</h3>
                <p className="font-inter text-sm text-[#374151] mt-1">Choose which channels you want to receive pricing intelligence alerts on.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9]">
                      <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-[#6b7280]">Alert Type</th>
                      <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-[#6b7280] text-center">Email</th>
                      <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-[#6b7280] text-center">Slack</th>
                      <th className="py-2.5 px-4 font-mono text-[11px] font-semibold uppercase text-[#6b7280] text-center">SMS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e2e8f0]">
                      <td className="py-4 px-4">
                        <div className="font-inter text-[#020520] font-semibold text-[14px]">Critical Changes</div>
                        <p className="text-[11px] text-[#6b7280] mt-0.5">High financial variance, critical selector failures</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalEmail}
                          onChange={() => handleToggleNotif("criticalEmail")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSlack}
                          onChange={() => handleToggleNotif("criticalSlack")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.criticalSms}
                          onChange={() => handleToggleNotif("criticalSms")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-[#e2e8f0]">
                      <td className="py-4 px-4">
                        <div className="font-inter text-[#020520] font-semibold text-[14px]">Warnings & Stales</div>
                        <p className="text-[11px] text-[#6b7280] mt-0.5">Node stales, DOM adaptation triggers</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningEmail}
                          onChange={() => handleToggleNotif("warningEmail")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSlack}
                          onChange={() => handleToggleNotif("warningSlack")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.warningSms}
                          onChange={() => handleToggleNotif("warningSms")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-[#e2e8f0] last:border-0">
                      <td className="py-4 px-4">
                        <div className="font-inter text-[#020520] font-semibold text-[14px]">Weekly Summaries</div>
                        <p className="text-[11px] text-[#6b7280] mt-0.5">Weekly executive summaries, change log lists</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestEmail}
                          onChange={() => handleToggleNotif("digestEmail")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSlack}
                          onChange={() => handleToggleNotif("digestSlack")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={notifs.digestSms}
                          onChange={() => handleToggleNotif("digestSms")}
                          className="rounded text-[#145aff] focus:ring-[#0099ff] h-4 w-4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSubTab !== "General" && activeSubTab !== "Notifications" && (
            <section className="bg-[#ffffff] border border-[#e2e8f0] rounded-[16px] p-8 shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] text-center">
              <span className="material-symbols-outlined text-[48px] text-[#6b7280] mb-2">construction</span>
              <h3 className="font-inter text-[18px] text-[#020520] font-semibold">{activeSubTab} Sub-tab</h3>
              <p className="font-inter text-[#6b7280] text-[14px] mt-1">This settings subsection is currently offline or configured by enterprise admins.</p>
            </section>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0] mt-4">
            <button
              onClick={() => navigate("/")}
              className="text-[#374151] font-inter font-medium text-[14px] px-4 py-2 hover:bg-[#f0f4fe] rounded-full transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[14px] px-6 py-2 rounded-full hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};

