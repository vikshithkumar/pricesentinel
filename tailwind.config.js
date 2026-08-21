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
        // Light Theme Core Blue-Gray Palette Tokens
        "signal-blue": "#3c83f6",
        "deep-dusk": "#022c70",
        "azure-crest": "#0544a5",
        "hover-glow": "#81b6ff",
        "ink-black": "#000000",
        "carbon": "#18181b",
        "slate-light": "#2e3038",
        "steel": "#5e616e",
        "fog": "#777a88",
        "mist": "#afb3c4",
        "vapor": "#edeef2",
        "frost": "#f3f8ff",
        "chalk": "#ffffff",
        "bone-light": "#e4e4e7",
        "ash-light": "#d7d7d7",
        "neon": "#00ff26",
        "cyan-veil": "#7df0f8",

        // Dimension Dark Theme Tokens
        "void-canvas": "#0a0a0a",
        "graphite": "#161616",
        "frosted-glass": "rgba(212, 212, 212, 0.1)",
        "snow-white": "#ffffff",
        "bone": "#ededed",
        "ash": "#c2c2c2",
        "slate": "#686868",
        "smoke": "#b2b2b2",
        "hairline": "rgba(229, 229, 229, 0.15)",
        "dusk-violet": "#6b62f2",

        // Semantic Mappings
        "critical-red": "#f26052",
        "warning-amber": "#ffa64d",
        "success-green": "#16ca2e",
        "focus-ring": "#6b62f2",
      },
      borderRadius: {
        "DEFAULT": "4px",
        "ui": "10px",
        "cards": "24px",
        "icons": "4px",
        "panels": "42px",
        "buttons": "9999px",
        "largecards": "40px",
        "sm": "4px",
        "md": "10px",
        "lg": "16px",
        "xl": "24px",
        "2xl": "32px",
        "3xl": "40px",
        "full": "9999px"
      },
      boxShadow: {
        "subtle": "rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        "glass": "rgba(0, 0, 0, 0.4) 0px 20px 40px -15px",
        "light-card": "rgba(0, 0, 0, 0.05) 0px 4px 12px",
        "violet-glow": "0 0 30px rgba(107, 98, 242, 0.3)",
      },
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
        "geist": ["Geist", "sans-serif"],
        "inter": ["Inter", "sans-serif"],
        "mono": ["Geist", "monospace"],
        "body": ["DM Sans", "sans-serif"],
        "display": ["DM Sans", "sans-serif"],
        "heading": ["Geist", "sans-serif"],
      }
    }
  },
  plugins: [],
}


