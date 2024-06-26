/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["dark"],
  },
  theme: {
    extend: {
      colors: {
        primary: "#ff9900", // Change the primary color to orange (#ff9900)
      },
    },
  },
  plugins: [require("daisyui")],
};
