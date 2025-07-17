/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#1DA1F2',
        'twitter-dark': '#15202B',
        'twitter-darker': '#192734',
        'twitter-light': '#8B98A5',
      },
    },
  },
  plugins: [],
}
