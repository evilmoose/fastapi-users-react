/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Your black, white, and gray color palette
          primary: {
            DEFAULT: '#000000', // Black
          },
          secondary: {
            DEFAULT: '#FFFFFF', // White
          },
          neutral: {
            100: '#F5F5F5', // Light Gray
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373', // Medium Gray
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717', // Dark Gray
          },
          accent: {
            blue: '#3B82F6',
            green: '#10B981',
            purple: '#8B5CF6',
            red: '#EF4444',
          }
        },
      },
    },
    plugins: [],
  }