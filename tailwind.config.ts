import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f17",
        foreground: "#e2e8f0",
        surface: {
          DEFAULT: "#111827",
          subtle: "#161f30",
          elevated: "#1e293b",
          border: "#253347",
          borderStrong: "#334155",
        },
        celo: {
          green: "#35D07F",
          greenDark: "#1FA860",
          gold: "#FBCC5C",
          goldDark: "#D8A336",
        },
        status: {
          success: "#35D07F",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#38BDF8",
          neutral: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
