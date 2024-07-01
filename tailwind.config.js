const withMT = require('@material-tailwind/react/utils/withMT');
const defaultTheme = require('tailwindcss/defaultTheme');

// https://tailwindcss.com/docs/font-family

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['Lato', ...defaultTheme.fontFamily.sans],
        // sans: ['Oswald', ...defaultTheme.fontFamily.sans],
        // sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        // sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        // sans: ['Raleway', ...defaultTheme.fontFamily.sans],
        // sans: ['Reddit Sans', ...defaultTheme.fontFamily.sans],
        // sans: ['Roboto Condensed', ...defaultTheme.fontFamily.sans],
        // sans: ['Ubuntu Sans', ...defaultTheme.fontFamily.sans],
        sans: ['Alata', ...defaultTheme.fontFamily.sans],
        // sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        // sans: ['Sawarabi Mincho', ...defaultTheme.fontFamily.sans],
        // sans: [...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: '540px',
      md: '720px',
      lg: '840px',
      'lg-max': {max: '840px'},
      xl: '840px',
      '2xl': '840px',
      '2xl-max': {max: '840px'},
    }
  },
  plugins: [],
});

