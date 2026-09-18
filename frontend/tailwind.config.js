/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          navy: '#002E6E',
          blue: '#002E6E',
          cyan: '#00BAF2',
          sky: '#00BAF2',
          lightBlue: '#E6F7FF',
          darkBlue: '#001E48',
          accent: '#00BAF2',
        },
        slate: {
          25: '#FCADF7',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'paytm-sm': '0 1px 3px 0 rgba(0, 46, 110, 0.06), 0 1px 2px -1px rgba(0, 46, 110, 0.04)',
        'paytm-card': '0 4px 20px -2px rgba(0, 46, 110, 0.05), 0 2px 6px -1px rgba(0, 46, 110, 0.03)',
        'paytm-lg': '0 10px 30px -4px rgba(0, 46, 110, 0.08), 0 4px 12px -2px rgba(0, 46, 110, 0.04)',
      },
    },
  },
  plugins: [],
};
