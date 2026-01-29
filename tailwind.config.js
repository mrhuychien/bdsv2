/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F59E0B',
        'primary-dark': '#D97706',
        secondary: '#1E3A5F',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
