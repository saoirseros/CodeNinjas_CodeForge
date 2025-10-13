/** @type {import('tailwindcss').Config} */
export default {
  // This array tells Tailwind which files to scan for class names (e.g., "flex", "bg-indigo-600").
  // This resolves the content warning you saw previously.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // We are extending the theme to use the 'Inter' font (as per the best practices plan)
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Example primary color used in Login.jsx and Navbar.jsx
        'primary': '#4f46e5', 
      }
    },
  },
  plugins: [],
}
