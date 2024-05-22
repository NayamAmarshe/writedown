/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "node_modules/preline/dist/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        mxs: { max: "400px" },
      },
      colors: {
        // Yes, the color is called with text-text-white
        /* "text-light": "#0B101D",
        "text-dark": "#EBECEE", */
        /* chalk: {
          50: "#fafbfc",
          75: "#eaeef3",
          100: "#e1e7ee",
          200: "#d4dce6",
          300: "#cbd5e1",
          400: "#8e959e",
          500: "#7c8289",
        },
        dusk: {
          50: "#ebecee",
          75: "#abb1b9",
          100: "#89919c",
          200: "#566172",
          300: "#334155",
          400: "#242e3b",
          500: "#1f2834",
        },
        midnight: {
          50: "#e7e8ea",
          75: "#9da0a8",
          100: "#747883",
          200: "#383e4e",
          300: "#0f172a",
          400: "#0b101d",
          500: "#0b101d",
        }, */
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: "" },
            "code::after": { content: "" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
  darkMode: "class",
};
