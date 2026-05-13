import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
      },
      colors: {
        // Toss Gray Scale
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F6",
          200: "#E5E8EB",
          300: "#D1D6DB",
          400: "#B0B8C1",
          500: "#8B95A1",
          600: "#6B7684",
          700: "#4E5968",
          800: "#333D4B",
          900: "#191F28",
        },
        // Toss Blue
        blue: {
          50: "#E8F3FF",
          100: "#C9E2FF",
          200: "#90C2FF",
          300: "#64A8FF",
          400: "#4593FC",
          500: "#3182F6",
          600: "#2272EB",
          700: "#1B64DA",
        },
        // Signal Colors
        teal: { 500: "#1D9E75" },
        red: { 500: "#F04452" },
        orange: { 500: "#F97316" },
        yellow: { 500: "#F59E0B" },
        // OVR Grade
        grade: {
          "s-bg": "#FFF8F0",
          "s-text": "#E8590C",
          "a-bg": "#E8F3FF",
          "a-text": "#3182F6",
          "b-bg": "#F2F4F6",
          "b-text": "#6B7684",
        },
        // Availability Status
        status: {
          available: "#1D9E75",
          negotiable: "#8B95A1",
          employed: "#D1D6DB",
        },
      },
      borderRadius: {
        "2xl": "16px",
        xl: "12px",
        lg: "8px",
      },
      borderWidth: {
        "0.5": "0.5px",
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "16px" }],
        xs: ["12px", { lineHeight: "18px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "22px" }],
        md: ["15px", { lineHeight: "22px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["18px", { lineHeight: "26px" }],
        "2xl": ["22px", { lineHeight: "30px" }],
      },
    },
  },
  plugins: [],
};
export default config;
