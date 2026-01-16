/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          border: '#404040',
        },
        json: {
          key: {
            light: '#2563eb',
            dark: '#a78bfa',
          },
          string: '#16a34a',
          number: '#ea580c',
          boolean: '#dc2626',
          null: '#9ca3af',
          brace: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
