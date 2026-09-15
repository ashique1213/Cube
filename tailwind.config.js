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
        cube: {
          dark: '#0a0d14',
          card: 'rgba(17, 24, 39, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
          white: '#ffffff',
          yellow: '#ffd500',
          red: '#dc2626',
          orange: '#ea580c',
          blue: '#2563eb',
          green: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 25px -5px rgba(245, 158, 11, 0.5)',
        'inner-glow': 'inset 0 0 15px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
