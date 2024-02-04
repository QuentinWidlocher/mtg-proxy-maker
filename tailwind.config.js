/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["MPlantin", "Merriweather", "serif"],
      }
    },
  },
  daisyui: {
    themes: [
      {
        mtg: {
          "primary": '#f59e0b',
          "secondary": "#d6d3d1",
          "accent": '#f59e0b',
          "neutral": "#78716c",
          "base-100": "#f5f5f4"
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('daisyui')
  ],
}

