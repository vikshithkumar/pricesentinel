# Tech Stack Memory

Technical composition of the project, including language constraints, package manager, and critical library dependencies.

## Core Framework & Libraries
- **React**: `^19.2.8` (Functional components, strict type-checking)
- **React DOM**: `^19.2.8`
- **React Router DOM**: `^7.18.2` (Configured with BrowserRouter in App.tsx)

## Styling
- **Tailwind CSS**: `^3.4.19`
- **PostCSS**: `^8.5.26`
- **Autoprefixer**: `^10.5.4`

## Language & Compiler
- **TypeScript**: `~6.0.2`
- **Target**: ES2023 / DOM library
- **Module Resolution**: Bundler mode (configured in [tsconfig.app.json](file:///D:/Into%20the%20Scrape-Verse/tsconfig.app.json))
- **Type Checking**: Strict unused locals/parameters enabled

## Tooling & Quality Assurance
- **Vite**: `^8.2.0` (Dev server, bundle generation)
- **Oxlint**: `^1.75.0` (Fast compiler-native lint rules)
- **Package Manager**: npm (requires node_modules/ and lockfile lock sync)