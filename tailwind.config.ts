import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A9B6F',
          dark: '#3A7D59',
          light: '#5BAD7F',
        },
        secondary: {
          DEFAULT: '#2C5F6F',
          dark: '#234B57',
          light: '#3A7A8F',
        },
        navy: {
          DEFAULT: '#2C3E50',
          dark: '#1A252F',
          light: '#34495E',
        },
        accent: {
          green: '#4A9B6F',
          teal: '#2C5F6F',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
