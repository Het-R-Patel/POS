/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Restaurant-themed color palette
        primary: {
          50: '#fef3e2',
          100: '#fde4b6',
          200: '#fbd389',
          300: '#f9c25c',
          400: '#f8b53a',
          500: '#f6a821', // Main orange
          600: '#e89816',
          700: '#d5850f',
          800: '#c27308',
          900: '#a15400',
        },
        secondary: {
          50: '#f5f7f9',
          100: '#e8ecf1',
          200: '#d1dae3',
          300: '#a9bccf',
          400: '#7c99b5',
          500: '#5b7c9e',
          600: '#476384',
          700: '#3a506c', // Main blue
          800: '#33445b',
          900: '#2e3b4d',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Red for alerts
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Green for success
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
