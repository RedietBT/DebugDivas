/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cursor: {
          bg: '#1e1e1e',
          panel: '#252526',
          border: '#3e3e42',
          text: '#cccccc',
          accent: '#007acc',
          error: '#f48771',
          warning: '#cca700',
          success: '#89d185',
        }
      }
    },
  },
  plugins: [],
}

