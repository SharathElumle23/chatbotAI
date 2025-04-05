module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slideInLeft: "slideInLeft 0.5s ease-out",
        slideInRight: "slideInRight 0.5s ease-out",
        orbit: "orbit 3s linear infinite",
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-50%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideInRight: {
          "0%": { transform: "translateX(50%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(10px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(10px) rotate(-360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
