const withMT = require("@material-tailwind/react/utils/withMT");
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: "540px",
      md: "720px",
      lg: "840px",
      "lg-max": {max: "840px"},
      xl: "840px",
      "2xl": "840px",
      "2xl-max": {max: "840px"},
    }
  },
  plugins: [],
})

