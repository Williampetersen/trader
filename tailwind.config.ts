import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Same order as apple.com: SF Pro on Apple devices, then Inter (see src/lib/fonts.ts) everywhere else.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          "var(--font-inter)",
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",

        "primary-accent": "var(--primary-accent)",
        "foreground-accent": "var(--foreground-accent)",
        "hero-background": "var(--hero-background)",

        // Apple-style marketing palette
        ink: "#1d1d1f",
        muted: "#6e6e73",
        subtle: "#86868b",
        line: "#d2d2d7",
        canvas: "#f5f5f7",
        accent: {
          DEFAULT: "#0071e3",
          hover: "#0077ed",
        },
        link: "#0066cc",
      },
    },
  },
  plugins: [],
};
export default config;
