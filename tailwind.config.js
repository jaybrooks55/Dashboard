/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e8ecff",
          200: "#c9d3ff",
          300: "#a3b3ff",
          400: "#7a8ffc",
          500: "#5b6cf0",
          600: "#4552d4",
          700: "#3740a8",
          800: "#2c3384",
          900: "#252a68",
        },
      },
    },
  },
  plugins: [],
};
