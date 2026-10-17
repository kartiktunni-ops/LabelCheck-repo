/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1C3F',
          50: '#EEF1F8',
          100: '#D6DCED',
          200: '#AEB9DB',
          300: '#8695C4',
          400: '#5C6DA5',
          500: '#3A4A80',
          600: '#243361',
          700: '#182548',
          800: '#0F1C3F',
          900: '#0A1330',
          950: '#060B1C',
        },
        saffron: {
          DEFAULT: '#F5A623',
          50: '#FEF6E9',
          100: '#FDEBC9',
          200: '#FBD891',
          300: '#F9C459',
          400: '#F7B53E',
          500: '#F5A623',
          600: '#D4870F',
          700: '#A2670C',
          800: '#704708',
          900: '#3E2705',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15, 28, 63, 0.12)',
        float: '0 12px 40px -8px rgba(15, 28, 63, 0.25)',
      },
    },
  },
  plugins: [],
}
