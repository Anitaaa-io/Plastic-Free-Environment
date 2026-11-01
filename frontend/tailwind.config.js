/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        emerald: {
          DEFAULT: '#10b981',
          dark: '#047857',
          deep: '#064e3b',
        },
        leaf: '#2d6a4f',
        nature: '#f4fbf7'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'eco': '0 10px 25px -5px rgba(22, 101, 52, 0.1), 0 8px 10px -6px rgba(22, 101, 52, 0.1)',
        'eco-lg': '0 20px 30px -10px rgba(20, 83, 45, 0.15)',
      }
    },
  },
  plugins: [],
}

