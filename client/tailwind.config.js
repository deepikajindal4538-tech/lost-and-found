/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F7F9',
          100: '#E4EDF5',
          200: '#C7D9E6',
          300: '#9FBBD0',
          400: '#739AB5',
          500: '#526D82', // Base primary
          600: '#415768',
          700: '#344654',
          800: '#2C3A46',
          900: '#253747', // Text dark slate
        },
        slate: {
          900: '#253747',
        },
        muted: '#7A8B9B',
        offwhite: '#F8FAFC',
        accent: '#E4EDF5',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(37, 55, 71, 0.06), 0 4px 6px -4px rgba(37, 55, 71, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(37, 55, 71, 0.08), 0 8px 10px -6px rgba(37, 55, 71, 0.04)',
        'soft-xl': '0 20px 35px -10px rgba(37, 55, 71, 0.1), 0 10px 15px -8px rgba(37, 55, 71, 0.05)',
      },
    },
  },
  plugins: [],
}
