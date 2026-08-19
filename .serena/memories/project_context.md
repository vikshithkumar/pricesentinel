# Project Context

This is the primary high-level context document for PriceSentinel. All future Serena agents should read this file before performing implementation tasks.

## 1. Project Identity

*   **Product Name:** PriceSentinel
*   **Purpose:** PriceSentinel is an AI-powered pricing intelligence and SaaS procurement command center.
*   **Core Problem:** SaaS and cloud vendor pricing pages change frequently, restructure plans, or update terms & conditions, leading to unexpected costs and complex manual tracking.
*   **Product Value:** Provides real-time visibility into vendor price changes, projects the financial impact of updates on the annual budget, and monitors the health of scrapers/crawlers.

---

## 2. Design Source of Truth

*   **Google Stitch Project ID:** `3195888936806393858`
*   **Canonical Screen Title:** `PriceSentinel Executive Dashboard (Connected)`
*   **Canonical Screen ID:** `73f1c3d463b44d40bfe574c63fdf162c`
*   **Design Invariance Policy:**
    *   Stitch is the absolute visual source of truth.
    *   Do not invent or merge designs from different Stitch variants.
    *   Other dashboard variants in the project (e.g., "PriceSentinel Executive Dashboard", "PriceSentinel Dashboard (Post-Recovery Refresh)", "PriceSentinel Dashboard") represent alternate states (stale, recovery, or disconnected) and are **not** the canonical baseline.

---

## 3. Current Implementation (Batches 0–2)

*   **Scaffold:** Vite + React 19 + TypeScript + Tailwind CSS v3.
*   **Routing:** `react-router-dom` v7.
*   **Global Shell:** Application wrapper including a fixed Sidebar, Header with workspace selectors/search, and SubHeader with greeting and telemetry status.
*   **Dashboard View:** Main layout utilizing a grid structure to display:
    *   [KpiCard](file:///d:/Into%20the%20Scrape-Verse/src/components/KpiCard.tsx): Vendors Monitored, Active Alerts count, Est. Annual Impact, Scraper Health.
    *   [RecentDetections](file:///d:/Into%20the%20Scrape-Verse/src/components/RecentDetections.tsx): Vendor price/tier/T&C changes list.
    *   [FinancialImpact](file:///d:/Into%20the%20Scrape-Verse/src/components/FinancialImpact.tsx): Custom bar chart showing monthly cost variance.
    *   [RecommendedActions](file:///d:/Into%20the%20Scrape-Verse/src/components/RecommendedActions.tsx): Suggested manual actions.
    *   [MonitoringHealth](file:///d:/Into%20the%20Scrape-Verse/src/components/MonitoringHealth.tsx): Visual status bars of live, degraded, and offline scrapers.
    *   [RecentActivity](file:///d:/Into%20the%20Scrape-Verse/src/components/RecentActivity.tsx): Scraper timeline events log.
*   **Batch 1 Components:**
    *   [Vendors](file:///d:/Into%20the%20Scrape-Verse/src/components/Vendors.tsx): Vendor Portfolio view.
    *   [Changes](file:///d:/Into%20the%20Scrape-Verse/src/components/Changes.tsx): Intelligence Feed / Changes list view.
    *   [ChangeDetails](file:///d:/Into%20the%20Scrape-Verse/src/components/ChangeDetails.tsx): Change Intelligence Detail view.
*   **Batch 2 Components:**
    *   [FinancialImpactDetail](file:///d:/Into%20the%20Scrape-Verse/src/components/FinancialImpactDetail.tsx): Financial Impact analysis with locally applied profile overrides.
    *   [ScraperHealth](file:///d:/Into%20the%20Scrape-Verse/src/components/ScraperHealth.tsx): Scraper telemetry center, including the corrected Last Scan column and aligned empty-state wording.
    *   [SelfHealingLab](file:///d:/Into%20the%20Scrape-Verse/src/components/SelfHealingLab.tsx): Self-healing simulation with the Baseline → Broken → Healing → Repaired → Apply Repair → Success flow.
    *   [SelfHealingSuccess](file:///d:/Into%20the%20Scrape-Verse/src/components/SelfHealingSuccess.tsx): Recovery confirmation and propagation view.
*   **Batch 3 Components:**
    *   [Watchlists](file:///d:/Into%20the%20Scrape-Verse/src/components/Watchlists.tsx): Watchlists overview grid with vendor counts, health percentages, and archived accordion.
    *   [Reports](file:///d:/Into%20the%20Scrape-Verse/src/components/Reports.tsx): Reports overview with sub-navigation categories sidebar and report cards grid.
    *   [ReportConfigure](file:///d:/Into%20the%20Scrape-Verse/src/components/ReportConfigure.tsx): Configure new report form layout.
    *   [ReportDetail](file:///d:/Into%20the%20Scrape-Verse/src/components/ReportDetail.tsx): Detail view for generated reports with metrics widgets and pricing changes table.
    *   [Alerts](file:///d:/Into%20the%20Scrape-Verse/src/components/Alerts.tsx): Intelligence feed with severity filters, active risk cards, and sidebar alert volume check.
    *   [Settings](file:///d:/Into%20the%20Scrape-Verse/src/components/Settings.tsx): Settings hub with profile management, regional preferences, 2FA toggle, and Notification Preferences matrix table.
*   **Batch 4 Responsive & Mobile Refinements:**
    *   Responsive/mobile shell implemented (main container left-margin offset adjusted to `md:ml-64`).
    *   Mobile sidebar drawer implemented (slide-out navigation overlay with backdrop blur for `< md` screens).
    *   Responsive [Header](file:///d:/Into%20the%20Scrape-Verse/src/components/Header.tsx) with mobile menu toggle icon and mobile padding (`px-margin-mobile md:px-margin-desktop`).
    *   Responsive [SubHeader](file:///d:/Into%20the%20Scrape-Verse/src/components/SubHeader.tsx) with flex-wrap direction (`flex-col sm:flex-row`).
    *   Responsive [ReportConfigure](file:///d:/Into%20the%20Scrape-Verse/src/components/ReportConfigure.tsx) schedule frequency radio button grid (`grid-cols-1 sm:grid-cols-3`).
    *   Responsive [ReportDetail](file:///d:/Into%20the%20Scrape-Verse/src/components/ReportDetail.tsx) key metrics cards grid (`grid-cols-1 sm:grid-cols-3`).
*   **Sidebar Navigation:** Updated to use React Router Link elements (replacing standard hash anchors).
*   **Dashboard Preservation:** The Batch 0 Dashboard remains completely intact.
*   **Recent Detections:** Links directly into the Intelligence Feed and specific Change Details.
*   **Data Separation:** UI components do not hardcode values; they draw from a centralized mock database in [mockData.ts](file:///d:/Into%20the%20Scrape-Verse/src/mockData.ts). Changes, Change Details, and Vendors use separated mock data.
*   **Current Routes:**
    *   `/` -> Dashboard
    *   `/vendors` -> Vendor Portfolio
    *   `/intelligence` -> Intelligence Feed / Changes
    *   `/intelligence/:id` -> Change Intelligence Detail
    *   `/intelligence/financial-impact` -> Financial Impact Analysis
    *   `/scrapers` -> Scraper Health Center
    *   `/scrapers/self-healing` -> Self-Healing Lab
    *   `/scrapers/self-healing/success` -> Self-Healing Success
    *   `/watchlists` -> Watchlists
    *   `/reports` -> Reports
    *   `/reports/configure` -> Configure New Report
    *   `/reports/detail/:id` -> Report Detail
    *   `/alerts` -> Alerts Feed
    *   `/settings` -> Settings Hub
    *   `*` -> Wildcard placeholder route ("Under Construction")
*   **Validation & Verification:**
    *   `npm run lint` passed with 0 warnings and 0 errors.
    *   `npm run build` passed successfully.

---

## 4. Batch Roadmap

*   **Batch 0:** Shell + canonical Dashboard — COMPLETE
*   **Batch 1:** Changes, Change Details, Vendors — COMPLETE
*   **Batch 2:** Financial Impact, Scraper Health, Self-Healing — COMPLETE
*   **Batch 3:** Watchlists, Reports, Alerts, Settings — COMPLETE
*   **Batch 4:** Mobile/responsive refinement — COMPLETE
*   **Final Audit:** Production/demo audit — NOT STARTED

---

## 5. Engineering Rules

1.  **Code Inspection:** Always inspect the existing codebase and design tokens before changing any architecture.
2.  **Reusability:** Reuse existing UI components and Tailwind custom utilities rather than duplicating code or introducing custom styles.
3.  **Data Isolation:** Keep data and state logic separate from visual presentation elements (use [mockData.ts](file:///d:/Into%20the%20Scrape-Verse/src/mockData.ts)).
4.  **No Requirements Invention:** Do not implement features or behavior not explicitly requested in the active batch.
5.  **No Design Drift:** Do not silently redesign Stitch layouts or merge designs from different variants.
6.  **No Early Implementation:** Work strictly on the current batch's scope.
7.  **No Silent Architecture Changes:** Do not make destructive architectural changes without user approval.
8.  **Preserve Decisions:** Respect established choices unless there is a clear, technical reason to change them.
9.  **Resolve Ambiguity:** Stop and ask the user for clarification rather than making assumptions.

---

## 6. Current Known Issues

*   **Dark Mode Toggle:** Although `dark:` variants and class-based config exist, there is no theme context provider or layout toggle switch.
*   **Version Control:** The project is not initialized as a git repository.
*   **Wildcard Navigation:** Future routes default to a placeholder screen.
*   **State Management Strategy:** The strategy for transitioning to active API telemetry (React Context vs. Zustand/Redux) is currently undecided.
*   **Workspace switching:** Multi-workspace logic has not yet been designed.

---

## 7. Source-of-Truth Order

When information conflicts, prioritize in this order:
1.  Explicit user-approved project decisions
2.  Google Stitch canonical design for visual/UI decisions
3.  Existing implemented code for current behavior
4.  `.serena/memories` project context (`project_context.md`)
5.  Other documentation
6.  Agent inference

*Never use inference to override an explicit decision.*

---

## 8. Agent Behavior

When working on PriceSentinel, the agent must:
*   Read `mem:project_context` before beginning significant implementation.
*   Inspect relevant files and components before writing code.
*   State assumptions and clarify ambiguities explicitly.
*   Work strictly within the requested batch scope.
*   Provide a list of files changed, validation performed, and any unresolved issues at the end of the turn.
