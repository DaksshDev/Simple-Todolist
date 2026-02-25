/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        bahiana: ['"Bahiana"', 'sans-serif'],
        barriecito: ['"Barriecito"', 'cursive'],
        chelsea: ['"Chelsea Market"', 'cursive'],
        comic: ['"Comic Neue"', 'cursive'],
        geist: ['"Geist Mono"', 'monospace'],
        jersey: ['"Jersey 10"', 'sans-serif'],   // <- quotes are critical
        press: ['"Press Start 2P"', 'monospace'],
        roboto: ['"Roboto"', 'sans-serif'],
        rubik: ['"Rubik Vinyl"', 'cursive'],
      },
    },
  },
  plugins: [],
}