import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import animation from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-sans)']
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' }
          }
        }
      },
      textShadow: {
        lg: '0 0 0.4rem var(--tw-shadow-color)'
      },
      colors: {
        primary: {
          xl: '#375781',
          lg: '#5876A2',
          md: '#7A97C5',
          sm: '#9CB9E9'
        },
        secondary: {
          xl: '#AC4A00',
          lg: '#CB630A',
          md: '#FFA854',
          sm: '#FFC671'
        },
        dark: {
          bg: '#1F1F22',
          highlight: '#18181A'
        }
      }
    }
  },
  plugins: [
    animation,
    typography(),
    plugin(function ({ addVariant }) {
      addVariant('prose-inline-code', '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))');
    }),
    plugin(function ({ addVariant }) {
      addVariant('prose-blockquote-p', '&.prose blockquote > p:not([class~="not-prose"])');
    }),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },

        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',

          /* Firefox */
          'scrollbar-width': 'auto',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block'
          }
        }
      });
    })
  ]
};
