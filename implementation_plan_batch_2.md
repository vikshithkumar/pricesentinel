# Implementation Plan — PriceSentinel Batch 2

This document outlines the visual inspection, layout choices, routing hierarchy, and component design for Batch 2: **Financial Impact**, **Scraper Health**, and **Self-Healing**.

---

## 1. Stitch Screens Inspected

We have thoroughly analyzed the Google Stitch project (`3195888936806393858`) and identified the screens corresponding to the three product areas:

### A. Financial Impact
*   **Financial Impact Analysis** (`cca1fffe747f420e84d74fecd4c7bd04`) [Canonical Desktop]:
    *   *Purpose*: Provides real-time and projected spend metrics, cost variance trends, and vendor impact scoring (OpenAI, Salesforce, AWS).
    *   *Major Sections*: Breadcrumbs (`Dashboard > Intelligence > Financial Impact`), Header with calculation timestamp & action buttons ("Export CSV", "Generate Procurement Report"), Stale Data Warning banner, Left Column (Spend metrics KPIs, Cost Variance trend chart placeholder, Spend by Category donut chart placeholder, Vendor Impact Scoring table), Right Column (Profile Overrides panel with fields to override seat counts and anchor dates).
*   **Financial Impact Analysis (Report Entry)** (`b7e911ba34eb466d8b4ce5d1b68ecf93`) [Variant]:
    *   *Difference*: A minor layout variant that duplicate primary report generation buttons and changes click targets to different mock routes. We will use the cleaner `cca1fffe747f420e84d74fecd4c7bd04` screen as the absolute baseline.

### B. Scraper Health
*   **Scraper Health Center** (`cf084f667ae6418ca2cc72f606b5adda`) [Canonical Desktop]:
    *   *Purpose*: Global scraper Nerve Center. Displays high-density scraper health metrics and log streams.
    *   *Major Sections*: Telemetry cards (Global Success Rate, Avg Latency, Active Scrapers), filter chips (All Sources, E-Commerce, Travel, Financial, Down), Main Scraper Telemetry table (Vendor, Collector ID, Status, Success %, Latency, Last Scan, context-sensitive action hover buttons), Right Column (Pipeline Activity logs & Self-Healing stats card linking to Lab).
*   **Scraper Health Center (Stale Data Management)** (`3b0506f9ba9a4b50a6ef0867003807a2`) [Variant]:
    *   *Difference*: Alternate view showing data freshness indicators (Fresh, Aging, Stale, Critical) and "Bulk Retry Stale" triggers. We will integrate this as a secondary toggle/view filter inside the canonical Scraper Health layout.
*   **Scraper Health Center Empty State** (`8c5682ad937943a9a3268f5e0aab53d0`) [Variant]:
    *   *Difference*: Empty state layout displaying a centered card ("No monitored collectors yet") with a "Start Monitoring" CTA.
*   **Scraper Health Center (Mobile)** (`6ae3f2551480467ea9dd5861f12a8462`) [Variant]:
    *   *Difference*: Mobile-responsive screen layout matching the desktop features.
*   **Scrapers (Nerve Center Cards Layout)** (`174a9a58526b4bb8b0770893177a0338`) [Variant]:
    *   *Difference*: Renders active scrapers as Bento-style grids/cards instead of a table. The table layout (`cf084f667ae6418ca2cc72f606b5adda`) will be the default, and we can offer cards layout as a toggled view mode.

### C. Self-Healing
*   **Self-Healing Lab (Integrated Shell)** (`9590b26da7ff41ab869d0b2464ae313d` / `da90795501ec4038a8030e8384171afe`) [Canonical Desktop]:
    *   *Purpose*: Standalone sandbox simulation page to test visual DOM mutations and AI-suggested repairs.
    *   *Major Sections*: Visual simulation panel (ACME Retail website canvas), DOM analysis & Logic Repair panel (Baseline logic, simulated selector failure, Sentinel AI suggestion diff, "Apply Repair" trigger), Telemetry metrics (Recovery time, confidence score, failed fields list), System Heartbeat logs.
*   **Self-Healing Demo (Integrated Shell)** (`b6be5c53fb0147d5b569f7cf01983d33`) [Variant]:
    *   *Difference*: A 3D Three.js scene showing node network topology status, mesh connectivity, and "Break Test" triggers. We will embed this visualization option in the Self-Healing Lab.
*   **Recovery Success & Data Propagation** (`7e99f2656e1d4fd3b8b86d0a216367df` / `244e49fdc9af419e83f8d8accfa5cee1` / `b42bb665a16c4be1a6887800add6e783`) [Canonical Success State]:
    *   *Purpose*: Transition view following repair. Confirms automated sync status (Fields Recovered, Quality, Confidence, Sync checks) and provides actions to return to health dashboard or view intelligence updates.

---

## 2. Canonical Screen Selection & Reasoning

*   **Financial Impact**: Selected `cca1fffe747f420e84d74fecd4c7bd04` to avoid the duplicated buttons in `b7e911ba34eb466d8b4ce5d1b68ecf93`.
*   **Scraper Health**: Selected `cf084f667ae6418ca2cc72f606b5adda` (table view) as the default layout to maintain SaaS tabular consistency and high density. The empty state (`8c5682ad937943a9a3268f5e0aab53d0`) and stale data filter (`3b0506f9ba9a4b50a6ef0867003807a2`) are treated as conditional UI rendering states within the Scrapers view.
*   **Self-Healing**:
    *   **Self-Healing Lab** is implemented as a **standalone page** (accessible at `/scrapers/self-healing`), which acts as an interactive simulation tool.
    *   It is not a simple popup, but a fully integrated sandbox layout.
    *   **Self-Healing Success** (`7e99f2656e1d4fd3b8b86d0a216367df`) is represented as a routed success step (`/scrapers/self-healing/success`) after the repair simulation is completed.

---

## 3. Proposed Routes

We will register these paths in [App.tsx](file:///d:/Into%20the%20Scrape-Verse/src/App.tsx):

*   `/intelligence/financial-impact` -> [FinancialImpactDetail.tsx](file:///d:/Into%20the%20Scrape-Verse/src/components/FinancialImpactDetail.tsx)
*   `/scrapers` -> [ScraperHealth.tsx](file:///d:/Into%20the%20Scrape-Verse/src/components/ScraperHealth.tsx)
*   `/scrapers/self-healing` -> [SelfHealingLab.tsx](file:///d:/Into%20the%20Scrape-Verse/src/components/SelfHealingLab.tsx)
*   `/scrapers/self-healing/success` -> [SelfHealingSuccess.tsx](file:///d:/Into%20the%20Scrape-Verse/src/components/SelfHealingSuccess.tsx)

*Note: The Financial Impact route is explicitly mapped to `/intelligence/financial-impact` to preserve the canonical information architecture and match the Stitch breadcrumb structure.*

---

## 4. Proposed Component Structure

We will introduce the following components under `src/components/`:

### 1. `FinancialImpactDetail.tsx` [NEW]
*   Renders the financial impact analytics.
*   Hosts local state for "Profile Overrides" (Seat Count, Avg Monthly Spend, Global Renewal Date). When applied, these locally adjust the annual spend metrics.
*   Includes a stale data banner if the mock scrapers status is Degraded.
*   Embeds SVG placeholders for the "Cost Variance Trend" bar chart and "Spend by Category" donut chart.

### 2. `ScraperHealth.tsx` [NEW]
*   Renders the Scraper Nerve Center.
*   The default `/scrapers` page will always display the canonical populated Scraper Health Center.
*   Does NOT add a settings/header toggle for empty state preview.
*   **Empty State Integration**: The empty state (`8c5682ad937943a9a3268f5e0aab53d0`) triggers naturally when filter selections or search queries result in zero scraper records. 
*   **Empty State Action**: The empty state view will feature a "Clear Filters" button which resets search inputs and restores the populated view.
*   Hosts toggles for:
    *   *View Mode* (Table View vs. Bento Cards View).
    *   *Filter Category* (All, E-Commerce, Travel, Financial, Down).
    *   *Freshness Mode* (standard telemetry vs. stale data management freshness badges).
*   Hosts action buttons:
    *   "Self-Healing Lab" -> routes to `/scrapers/self-healing`.
    *   "Heal Node" on table rows -> routes to `/scrapers/self-healing` pre-loaded with that collector context.
    *   "Restart Node" on failed table rows -> triggers local spinner state transition.
*   Includes a scrollable right pane for Pipeline Activity stream.

### 3. `SelfHealingLab.tsx` [NEW]
*   Renders the interactive code mapping diff sandbox.
*   Hosts simulation states:
    *   *Baseline*: "Healthy" status, ACME Retail mockup.
    *   *Broken*: Triggers when clicking "Break Test Website". Visual mutations occur, status shifts to "Failed" with red pips, DOM diff editor highlights selector mismatch, confidence telemetry drops, system log prints "NullReference".
    *   *Healing*: Spinning recovery telemetries.
    *   *Repaired*: Shows "Apply Repair" button. Clicking it pushes the user to the `/scrapers/self-healing/success` route.
*   Optionally embeds a canvas for node network mesh animation (simplifying the Three.js scene overlay).

### 4. `SelfHealingSuccess.tsx` [NEW]
*   Success landing page.
*   Renders the metrics card (Vendor, sync status, recovery time, validation pass).
*   Hosts CTA buttons: "View Intelligence Update" (routes to `/intelligence`) and "Back to Scraper Health" (routes to `/scrapers`).

---

## 5. Required Mock-Data Additions

We will append the following collections to [mockData.ts](file:///d:/Into%20the%20Scrape-Verse/src/mockData.ts):

*   **Financial Impact Scores**: Detailed records for impact score (0-100), core drivers list, and annual delta value for each vendor.
*   **Scraper Nodes**: High density status metadata for scrapers:
    ```typescript
    export interface ScraperNode {
      id: string;
      vendor: string;
      collectorId: string;
      category: 'ecommerce' | 'travel' | 'financial';
      status: 'healthy' | 'degraded' | 'recovering' | 'failed' | 'stale' | 'critical-stale';
      successRate: number;
      latencyMs: number;
      lastScanText: string;
      lastScanTime: Date;
    }
    ```
*   **Pipeline Activity Log**: A log model containing log severity (success, warning, error), message templates, timestamps, and size details.

---

## 6. Navigation Relationships & Stitch Interaction Fidelity

To maintain strict visual and interaction fidelity with the Stitch design source of truth, we will only implement interactions explicitly represented in the design:

### Verified Interactive Elements (Active)
*   **Dashboard "Est. Annual Impact" KPI Card**: Navigates to `/intelligence/financial-impact` (represented by `onclick` in Stitch layout `73f1c3d463b44d40bfe574c63fdf162c`).
*   **Dashboard "Scraper Health" KPI Card**: Navigates to `/scrapers` (represented by `onclick` in Stitch layout `73f1c3d463b44d40bfe574c63fdf162c`).
*   **Dashboard "Financial Impact Overview" Mini-chart**: Clicking the container navigates to `/intelligence/financial-impact` (represented by `onclick` in Stitch layout `73f1c3d463b44d40bfe574c63fdf162c`).
*   **Sidebar Links**: Links in `Sidebar.tsx` will route to `/scrapers` (Scrapers) and `/intelligence/financial-impact` (Intelligence -> Financial Impact breadcrumb path).
*   **Scrapers Table Action Buttons**: "Heal Node" routes into `/scrapers/self-healing`.

### Unrepresented Elements (Static)
*   **Dashboard Recent Activity Log Items**: Stitch does *not* specify interaction handlers for these items; they will remain completely static text elements. We will not invent navigation actions here.

---

## 7. UI Interactions Represented by Stitch

We will support the following interactive behaviors locally:
1.  **Break Test website simulator**: Mutates selectors from `.price-tag` to `[data-test="current-price"]` and updates code editor panels and log heartbeats.
2.  **Telemetry overrides form**: Real-time recalculation of projected spend based on input changes.
3.  **Log Heartbeat Stream**: Simulated interval additions to the log feed container.
4.  **Network Mesh Toggle**: Switch between DOM code diffing layout and a 3D topology demonstration canvas.

---

## 8. Validation Plan

### Automated Verification
*   Execute `npm run lint` to ensure zero compilation or styling warnings.
*   Execute `npm run build` to verify clean production bundles.

### Manual Verification
*   Test browser routing transitions (forward, backward, refresh).
*   Test override calculations to ensure correct arithmetic propagation.
*   Trigger "Break Test" and "Apply Repair" to ensure the state machine routes successfully.

---

## 9. Ambiguity & Architectural Boundaries

> [!IMPORTANT]
> **Definitive Boundaries**:
> 1. We will **NOT** write any backend server communication or API endpoints. All simulations and telemetry updates run strictly client-side in React state.
> 2. We will **NOT** pull real scraping logs. Log stream feeds use randomized client-side timers.
> 3. We will **NOT** implement actual DOM query parsing. The code diffs are mock code panels represented as static strings.
> 4. We will **NOT** set up real database schemas or state libraries (like Zustand). Component parameters and simple context providers will maintain layout persistence.
> 5. We will **NOT** add any authentication or access-control middleware. All routes remain publicly accessible inside the app.
