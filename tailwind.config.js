/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "node_modules/preline/dist/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /from-/,
    },
    {
      pattern: /to-/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin"), require("@tailwindcss/forms")],
  darkMode: "class",
};
