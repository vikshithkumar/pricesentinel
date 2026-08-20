/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Relate DESIGN.md Exact Tokens
        "snow-canvas": "#fcfcfc",
        "lavender-wash": "#f0f4fe",
        "midnight-ink": "#020520",
        "graphite-body": "#14141e",
        "slate-caption": "#374151",
        "ash-helper": "#6b7280",
        "stone-divider": "#e2e8f0",
        "fog-surface": "#f1f5f9",
        "royal-signal": "#145aff",
        "cobalt-glow": "#3b82f6",
        "mint-win": "#16ca2e",
        "coral-lost": "#f26052",
        "amber-pending": "#ffa64d",
        "azure-focus": "#0099ff",

        // Semantic Role Mappings to Relate Tokens
        "background": "#fcfcfc",
        "surface-wash": "#f0f4fe",
        "canvas-white": "#ffffff",
        "surface-pearl": "#f1f5f9",
        "ink": "#020520",
        "graphite": "#14141e",
        "secondary": "#374151",
        "helper": "#6b7280",
        "hairline": "#e2e8f0",
        "primary": "#145aff",
        "on-primary": "#ffffff",
        "critical-red": "#f26052",
        "warning-amber": "#ffa64d",
        "success-green": "#16ca2e",
        "focus-ring": "#0099ff",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "4px",
        "md": "8px",
        "lg": "12px",
        "xl": "16px",
        "2xl": "20px",
        "3xl": "40px",
        "full": "9999px"
      },
      boxShadow: {
        "sm": "rgba(0, 0, 0, 0.1) 0px 0px 4px -2px",
        "sm-2": "rgba(0, 0, 0, 0.25) 0px 0px 4px -2px",
        "xl": "rgba(20, 90, 255, 0.1) 0px 0px 100px -28px",
        "sm-3": "rgba(20, 90, 255, 0.3) 0px 0px 4px -2px",
        "xl-2": "rgba(20, 90, 255, 0.1) 0px 0px 50px -28px, rgba(0, 0, 0, 0.18) 0px 0px 3px -1px"
      },
      fontFamily: {
        "inter": ["Inter", "sans-serif"],
        "pretendard": ["Pretendard", "sans-serif"],
        "mono": ["Roboto Mono", "monospace"],
        "body": ["Inter", "sans-serif"],
      }
    }
  },
  plugins: [],
}

