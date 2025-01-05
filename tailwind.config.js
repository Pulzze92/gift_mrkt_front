/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
    extend: {
      fontSize: {
        'adaptive-title': 'clamp(1.5rem, 4vw, 2.5rem)',
        'adaptive-body': 'clamp(0.875rem, 2vw, 1rem)',
      },
    },
  },
  plugins: [],
};
