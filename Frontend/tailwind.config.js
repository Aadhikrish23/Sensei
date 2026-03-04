/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samurai: {
          bg: "#F5F1E8",
          card: "#FFFFFF",
          primary: "#8B1E1E",
          primaryHover: "#6E1414",
          accent: "#C6A75E",
          text: "#1C1C1C",
          muted: "#6B6B6B",
          border: "#E6DFD2",
        },
        ninja: {
          bg: "#0F0F12",
          card: "#1A1A1F",
          primary: "#B11226",
          primaryHover: "#D61F3A",
          accent: "#00F0FF",
          text: "#F5F5F5",
          muted: "#9CA3AF",
          border: "#2A2A30",
        },
      },
    },
  },
}