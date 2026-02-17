import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4D3E',
          dark: '#143A2F',
          light: '#256B55',
        },
        secondary: {
          DEFAULT: '#C8A96E',
          dark: '#B8955A',
          light: '#D4BB85',
        },
        navy: {
          DEFAULT: '#1A1A2E',
          dark: '#0F0F1A',
          light: '#2A2A45',
        },
        accent: {
          gold: '#C8A96E',
          green: '#1B4D3E',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
