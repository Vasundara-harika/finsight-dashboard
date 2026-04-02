/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFF7ED',
        },
        income: '#22C55E',
        expense: '#EF4444',
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          text: '#F1F5F9',
          muted: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
}
