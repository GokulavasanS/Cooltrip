/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#4F8CFF",
        cyan: "#62D4E3",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "30px",
      },
      backdropBlur: {
        glass: "24px",
      },
    },
  },
  plugins: [],
};
