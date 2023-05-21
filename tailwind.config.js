/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /text-/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fbbb04",
        lightGray: "#d8d8d8",
        card: "#1F1F1F",
      },
    },
  },
};
