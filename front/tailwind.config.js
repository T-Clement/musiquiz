import theme from './src/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
      }
    },
  },
  plugins: [],
}