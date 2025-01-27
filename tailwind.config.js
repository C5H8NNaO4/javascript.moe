/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  safelist: [
    {
      pattern: /!min.w.*/
    },
    {
      pattern: /.*intlink.*/
    }
  ],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        internal: colors.sky, // Adding the `intlink` custom color
      },
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
        nohover: {
          raw: "(hover: none)",
        },
      },
    },
  },
  plugins: [],
};
