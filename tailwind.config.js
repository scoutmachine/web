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
        lightGray: "#a6a6a6",
        card: "#1F1F1F",
      },
    },
  },
  plugins: [
		require("tailwindcss-animate"),
	],
};
