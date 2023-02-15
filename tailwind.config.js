/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "node_modules/preline/dist/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "from-teal-400",
    "to-blue-500",
    "from-sky-500",
    "to-indigo-600",
    "from-violet-500",
    "to-fuchsia-500",
    "from-purple-500",
    "to-pink-500",
    "from-green-700",
    "to-green-400",
    "from-orange-400",
    "to-yellow-200",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("preline/plugin"),
    require("@tailwindcss/forms"),
  ],
  darkMode: "class",
};
