/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 0 10px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
};