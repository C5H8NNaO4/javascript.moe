/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      "3xs": "0px",
      "2xs": "260px",
      xs: {
        raw: "(max-width: 320px)",
      },
      xsls: {
        raw: "(max-height: 412px)",
      },
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      landscape: {
        raw: "(orientation: landscape)",
      },
      'nohover': {'raw': '(hover: none)'},
    },
    extend: {},
  },
  plugins: [],
};
