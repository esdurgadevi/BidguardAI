/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crpf: {
          dark: '#1a202c', // Navy Blue
          gold: '#d4af37', // Gold for accents
          red: '#b91c1c',  // CRPF Red
        }
      }
    },
  },
  plugins: [],
}
