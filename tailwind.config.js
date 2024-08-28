/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        larablue: 'rgb(96, 165, 250)',
      },
      boxShadow: {
        'menuActive': '0 0 0 2px #1c2127, 0 0 0 4px rgba(96, 165, 250, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0)',
      },
      fontFamily: {
        sans: ['"Inter var"', 'sans-serif'],
      },
    },
  },
  plugins: [],

  
}

