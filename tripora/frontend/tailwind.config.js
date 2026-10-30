/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#2864D8',
          50: '#F0F5FF',
          100: '#E0EBFE',
          200: '#BAD2FD',
          300: '#8BB5FB',
          400: '#5490F7',
          500: '#2864D8',
          600: '#1D4EB8',
          700: '#173D94',
          800: '#153377',
          900: '#152C63',
        },
        coral: {
          DEFAULT: '#FF786B',
          50: '#FFF5F4',
          100: '#FFE9E6',
          200: '#FFD7D2',
          300: '#FFB8B0',
          400: '#FF978C',
          500: '#FF786B',
          600: '#E85445',
          700: '#C23E30',
          800: '#A13428',
          900: '#853028',
        },
        warm: {
          DEFAULT: '#FAFAF7',
          50: '#FFFFFF',
          100: '#FAFAF7',
          200: '#F4F4EE',
          300: '#ECECE2',
          400: '#DFDFD1',
          500: '#C8C8B5',
        },
        lavender: {
          DEFAULT: '#E9E5FF',
          50: '#FAF9FF',
          100: '#F4F1FE',
          200: '#E9E5FF',
          300: '#D5CCFF',
          400: '#B6A3FE',
          500: '#9475FB',
        },
        surface: {
          pale: '#F0F5FF',
          card: '#FFFFFF',
          subtle: '#F8FAFC',
        },
        charcoal: {
          DEFAULT: '#1E293B',
          light: '#334155',
          muted: '#64748B',
          border: '#E2E8F0',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(40, 100, 216, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px -4px rgba(40, 100, 216, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'magazine': '0 20px 40px -8px rgba(30, 41, 59, 0.12), 0 8px 16px -4px rgba(40, 100, 216, 0.06)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}

