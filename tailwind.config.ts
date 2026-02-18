import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        sand: '#F0EBE3',
        taupe: {
          100: '#EDE6DE',
          200: '#D4C8BA',
          300: '#B8A898',
          400: '#A89282',
          500: '#8C7565',
          600: '#6B5A4D',
        },
        sage: {
          DEFAULT: '#8B9E8B',
          light: '#A8B8A8',
          dark: '#6B7F6B',
        },
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#4A4A4A',
          muted: '#7A7A7A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 12px rgba(44, 44, 44, 0.04)',
        'soft-lg': '0 4px 24px rgba(44, 44, 44, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
