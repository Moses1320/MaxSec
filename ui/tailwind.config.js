module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette (modified from provided)
        space: {
          50: "#f0f2f8",
          100: "#dfe3f0",
          200: "#c0c8e0",
          300: "#a1aed1",
          400: "#5f6b98",      // Modified: lighter for better contrast
          500: "#3d4563",      // Modified: original base
          600: "#2B2D42",      // Primary (original)
          700: "#1f2031",
          800: "#151820",
          900: "#0b0f1e",
        },
        lavender: {
          50: "#f5f6fa",
          100: "#e8eaf4",
          200: "#d5d9e8",
          300: "#c2c9dd",
          400: "#a8b3cc",      // Modified: stronger
          500: "#8D99AE",      // Secondary (original)
          600: "#7a839b",
          700: "#616d88",
          800: "#4a5675",
          900: "#333f5c",
        },
        platinum: {
          50: "#fafbfc",
          100: "#f5f7f9",
          200: "#eef2f4",      // Modified: slightly warmer
          300: "#e8ecf0",
          400: "#dce2e8",
          500: "#EDF2F4",      // Background (original)
          600: "#d9dfe5",
          700: "#bec6ce",
          800: "#a3adb8",
          900: "#8895a2",
        },
        strawberry: {
          50: "#fef2f3",
          100: "#fce5e8",
          200: "#f8cad1",
          300: "#f5afba",
          400: "#f1949f",      // Modified: expanded palette
          500: "#EF233C",      // Alert (original)
          600: "#e01d35",
          700: "#c4182d",
          800: "#a81424",
          900: "#8c101c",
        },
        flag: {
          50: "#fef1f2",
          100: "#fde3e6",
          200: "#fcc7cc",
          300: "#faaab3",
          400: "#f98e99",
          500: "#D90429",      // Critical (original)
          600: "#c10324",
          700: "#a2021e",
          800: "#840219",
          900: "#660113",
        },
      },
      borderRadius: {
        "xs": "8px",
        "sm": "10px",
        "base": "12px",
        "lg": "14px",
        "xl": "16px",
        "2xl": "20px",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(11, 15, 30, 0.08)",
        "medium": "0 4px 16px rgba(11, 15, 30, 0.12)",
        "elevated": "0 8px 24px rgba(11, 15, 30, 0.16)",
        "focus": "0 0 0 3px rgba(61, 69, 99, 0.1)",
      },
      spacing: {
        "safe": "env(safe-area-inset-left)",
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
        "mono": ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["13px", { lineHeight: "18px" }],
        "base": ["15px", { lineHeight: "20px" }],
        "lg": ["16px", { lineHeight: "22px" }],
        "xl": ["18px", { lineHeight: "26px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["22px", { lineHeight: "32px" }],
        "4xl": ["28px", { lineHeight: "36px" }],
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        slideIn: {
          "from": { transform: "translateY(10px)", opacity: "0" },
          "to": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
        slideIn: "slideIn 0.2s ease-out",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
