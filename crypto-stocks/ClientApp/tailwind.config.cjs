/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("radix-colors-for-tailwind")({
            colors: ["blue", "slate", "green", "red"],
        }),
        require("@tailwindcss/forms"),
    ],
};
