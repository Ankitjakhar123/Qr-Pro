/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amoled: {
          bg: '#000000',
          card: '#0a0a0a',
          border: '#1a1a1a',
          text: '#ffffff',
          muted: '#a1a1aa',
          accent: '#00ff88',
          blue: '#00d4ff',
          purple: '#8b5cf6',
          red: '#ef4444',
          yellow: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
};