/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        card: "#ffffff",
        primary: "#0f172a",
        "primary-foreground": "#f8fafc",
        accent: "#0ea5e9",
        muted: "#f1f5f9",
        "muted-foreground": "#64748b",
        success: "#16a34a",
        destructive: "#dc2626",
        highlight: "#fef08a",
        secondary: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
