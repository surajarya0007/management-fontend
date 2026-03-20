import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        obsidian: {
          950: "#050708",
          900: "#0a0d0d",
          800: "#0f1314",
          750: "#121a1b",
          700: "#141d1f",
          600: "#161f21",
          500: "#1f2e2d",
          border: "#1f2e2d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
