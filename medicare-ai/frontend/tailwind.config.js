/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'severity-low': '#22c55e',   // green
        'severity-mod': '#eab308',   // yellow
        'severity-high': '#ef4444',  // red
      },
    },
  },
  plugins: [],
}