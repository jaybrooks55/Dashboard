/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fbf7ee",
          100: "#f6efdc",
          200: "#ecdfc0",
          300: "#dfc99c",
          400: "#cfae76",
          500: "#bd9457",
          600: "#a17840",
          700: "#7d5c33",
          800: "#5c452a",
          900: "#3a2f22",
        },
        maroon: {
          50: "#f7e9e9",
          100: "#eecece",
          200: "#dda3a3",
          300: "#c67575",
          400: "#a94848",
          500: "#8a2a2a",
          600: "#7a1f1f",
          700: "#6b1414",
          800: "#59100f",
          900: "#4a0e0e",
        },
      },
      fontFamily: {
        display: ['"Cinzel"', "serif"],
        serif: ['"EB Garamond"', '"Cormorant Garamond"', "serif"],
      },
    },
  },
  plugins: [],
};
