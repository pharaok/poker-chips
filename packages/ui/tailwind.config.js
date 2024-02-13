/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.tsx"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "var(--slide-from)", opacity: 0 },
          "100%": {
            transform:
              "translate(var(--tw-translate-x), var(--tw-translate-y))",
            opacity: 1,
          },
        },
      },
      animation: {
        "slide-in": "slide 150ms",
        "slide-out": "slide 150ms reverse",
      },
    },
  },
  plugins: [],
};
