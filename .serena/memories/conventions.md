# Conventions Memory

Coding conventions, design systems, routing mechanisms, and dark mode features.

## Styling & Design Tokens
- **Tailwind Utility Classes**: Styling is written strictly with Tailwind classes. Avoid custom CSS files.
- **Custom Design Tokens**: Defined in [tailwind.config.js](file:///D:/Into%20the%20Scrape-Verse/tailwind.config.js).
  - *Colors*: `primary`, `canvas-white`, `canvas-parchment`, `ink`, `critical-red`, `warning-amber`, `success-green`, `sky-link`, `surface-container-low` etc. Use Tailwind utility names directly (e.g. `text-critical-red`, `bg-canvas-parchment`).
  - *Spacing*: `margin-desktop` (40px), `gutter` (24px), `xl` (32px), `lg` (24px), `md` (17px), `sm` (12px), `xs` (8px). Use utility classes like `p-margin-desktop`, `gap-gutter`.
- **Fonts**: Use `Inter` globally (defined as default `font-family` in index.html and index.css). Specific text components use custom fonts/sizes defined under custom Tailwind extensions: `font-tagline`, `text-tagline`, `font-body-strong`, `text-body-strong`, `font-display-md`, `text-display-md`, `font-data-tabular`, `text-data-tabular` etc.
- **Icons**: Material Symbols Outlined are loaded globally in [index.html](file:///D:/Into%20the%20Scrape-Verse/index.html). Standard syntax is `<span className="material-symbols-outlined">icon_name</span>`.

## State & Routing
- **Stale Data / Mocking**: Data resides statically in [src/mockData.ts](file:///D:/Into%20the%20Scrape-Verse/src/mockData.ts). Avoid hardcoding data directly in UI components; update/enrich the mock datasets instead.
- **Sidebar & Router**: Currently Sidebar ([src/components/Sidebar.tsx](file:///D:/Into%20the%20Scrape-Verse/src/components/Sidebar.tsx)) uses mock anchors with `#` and `e.preventDefault()`. To implement actual navigation, update links to use `<Link to="...">` from `react-router-dom` and map actual components in [src/App.tsx](file:///D:/Into%20the%20Scrape-Verse/src/App.tsx)'s routing table.

## Dark Mode
- Configured as Class-based in [tailwind.config.js](file:///D:/Into%20the%20Scrape-Verse/tailwind.config.js) (`darkMode: "class"`).
- Dark mode states exist in Sidebar (`dark:bg-inverse-surface`, `dark:text-canvas-white`) but there is no runtime toggle implemented.