/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7FB',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F1F0F7',
          subtle: '#FAF9FD',
        },
        ink: {
          DEFAULT: '#24212B',
          secondary: '#706B78',
          muted: '#948E9F',
        },
        border: {
          DEFAULT: '#E3E0EA',
          subtle: '#EAE7F0',
          dark: '#D1CDDA',
        },
        purple: {
          DEFAULT: '#6D4AFF',
          primary: '#6D4AFF',
          deep: '#4930A8',
          soft: '#EDE8FF',
          light: '#F4F0FF',
        },
        status: {
          alert: '#D94A4A',
          'alert-soft': '#FDF2F2',
          warning: '#C58A25',
          'warning-soft': '#FEF9EE',
          safe: '#3B8F67',
          'safe-soft': '#EBF7EE',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(36, 33, 43, 0.04), 0 1px 2px -1px rgba(36, 33, 43, 0.02)',
        'elevated': '0 4px 12px 0 rgba(109, 74, 255, 0.06), 0 1px 3px 0 rgba(36, 33, 43, 0.04)',
      },
    },
  },
  plugins: [],
}

