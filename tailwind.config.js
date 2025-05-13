/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111827",
        input: "#f9fafb",
        border: "#e5e7eb",
        ring: "#3b82f6",
      },
    },
  },
  plugins: [],
};
