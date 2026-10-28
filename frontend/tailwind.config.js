/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bpjs: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#10B981',
          600: '#009640',
          700: '#00883E',
          800: '#006930',
          900: '#004D23',
        }
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Times New Roman"', 'Tinos', 'Georgia', 'serif'],
        document: ['"Times New Roman"', 'Tinos', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'liquid': '0 8px 32px 0 rgba(0, 150, 64, 0.08), 0 2px 8px 0 rgba(15, 23, 42, 0.04)',
        'liquid-hover': '0 14px 44px 0 rgba(0, 150, 64, 0.14), 0 4px 12px 0 rgba(15, 23, 42, 0.06)',
        'glass-glow': '0 0 24px 2px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
