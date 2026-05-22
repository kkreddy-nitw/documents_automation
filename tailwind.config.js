/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#F5F7FA',
        accent: '#0A66FF',
        accentSoft: '#E8F0FF',
        success: '#0EA55B'
      },
      boxShadow: {
        soft: '0 4px 18px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
