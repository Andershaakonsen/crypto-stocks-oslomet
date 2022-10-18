/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("radix-colors-for-tailwind")({
      colors: ["blue", "slate"],
    }),
  ],
};
