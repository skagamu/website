import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0C2340",
        amber: "#F59E0B",
        crimson: "#E11D48"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Arial", "sans-serif"],
        body: ["var(--font-inter)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
