/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      aqua: '#17AFC0',
      pale: '#F3FAFB',
      teal: '#164E59',
      borderSoft: '#D9E9EB'
    },
    boxShadow: { soft: '0 5px 22px rgba(22, 78, 89, 0.05)' }
  }},
  plugins: []
}