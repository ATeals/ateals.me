import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shadcn/src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      textShadow: {
        lg: "0 0 0.4rem var(--tw-shadow-color)",
      },
      colors: {
        primary: {
          xl: "#375781",
          lg: "#5876A2",
          md: "#7A97C5",
          sm: "#9CB9E9",
        },
        secondary: {
          xl: "#AC4A00",
          lg: "#CB630A",
          md: "#FFA854",
          sm: "#FFC671",
        },
        dark: {
          bg: "#232326",
        },
      },
      animation: {
        turn: "turn 0.7s ease-out",
        fadeIn: "fadeIn 0.7s ease-in-out",
        darkening: "darkening 1s ease-in-out",
        fadeInDown: "fadeInDown 0.7s ease-in-out",
      },
      keyframes: {
        turn: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        darkening: {
          "0%": {
            opacity: "0",
            backgroundOpacity: "0",
          },
          "100%": {
            opacity: " 0.4",
            backgroundOpacity: "0.4",
          },
        },
      },
    },
  },
  plugins: [
    typography,
    plugin(function ({ addVariant }) {
      addVariant(
        "prose-inline-code",
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))'
      );
    }),
    plugin(function ({ addVariant }) {
      addVariant("prose-blockquote-p", '&.prose blockquote > p:not([class~="not-prose"])');
    }),

    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },

        ".scrollbar-default": {
          /* IE and Edge */
          "-ms-overflow-style": "auto",

          /* Firefox */
          "scrollbar-width": "auto",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "block",
          },
        },
      });
    }),
  ],
};
export default config;
