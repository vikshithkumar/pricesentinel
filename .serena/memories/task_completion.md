# Task Completion Memory

Verification checklist for submitting task edits.

## Static Analysis & Verification
- **Lint Check**: Run `npm run lint`. Ensure zero compilation errors or Oxlint warnings/errors.
- **Build Check**: Run `npm run build`. This runs `tsc -b` for type-checking and compiles files with Vite. Both stages must complete with exit code 0.

## Coding Checklist
- Ensure no inline styles are introduced unless dynamic. Styling must use Tailwind classes matching the project design system (custom margins, colors, etc.).
- Update [src/mockData.ts](file:///D:/Into%20the%20Scrape-Verse/src/mockData.ts) if components require new structure/data, keeping mock files as the single source of data.
- Ensure TypeScript files are fully typed (no `any` types unless strictly necessary).