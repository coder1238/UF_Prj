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
        canvas: '#F8F7FC',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F2F0F8',
          subtle: '#EEE9FF',
        },
        ink: {
          DEFAULT: '#18151F',
          secondary: '#484556',
          muted: '#716C7C',
          light: '#A39EAF',
        },
        primary: {
          DEFAULT: '#6D4AFF',
          hover: '#5835E5',
          deep: '#38256B',
          soft: '#EEE9FF',
          tint: '#F4EEFF',
        },
        purple: {
          DEFAULT: '#6D4AFF',
          primary: '#6D4AFF',
          hover: '#5835E5',
          deep: '#38256B',
          soft: '#EEE9FF',
          tint: '#F4EEFF',
          light: '#8F75FF',
          50: '#FAF8FF',
          100: '#EEE9FF',
          200: '#D9CFFF',
          300: '#B8A6FF',
          400: '#9478FF',
          500: '#6D4AFF',
          600: '#5835E5',
          700: '#4624C4',
          800: '#38256B',
          900: '#231548',
        },
        'purple-primary': '#6D4AFF',
        'purple-deep': '#38256B',
        'purple-soft': '#EEE9FF',
        'purple-tint': '#F4EEFF',
        border: {
          DEFAULT: '#E5E0EF',
          dark: '#CCC6D8',
          focus: '#6D4AFF',
        },
        flood: {
          safe: '#217A52',
          caution: '#B7791F',
          danger: '#B42318',
          critical: '#7A1F35',
          water: '#6657C8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(24, 21, 31, 0.05), 0 1px 2px 0 rgba(24, 21, 31, 0.03)',
        'card': '0 4px 12px 0 rgba(109, 74, 255, 0.06), 0 1px 3px 0 rgba(24, 21, 31, 0.04)',
        'elevated': '0 10px 25px -5px rgba(56, 37, 107, 0.08), 0 8px 10px -6px rgba(56, 37, 107, 0.04)',
      }
    },
  },
  plugins: [],
}
