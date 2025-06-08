/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // tailwind.config.js (optional customization)
theme: {
  extend: {
    colors: {
      primary: '#003087', 
      secondary: '#F9A825', // golden yellow accent
    },
    fontFamily: {
      sans: ['"Open Sans"', 'sans-serif'],
    }
  }
},
  plugins: [],
}
