import type { Config } from 'tailwindcss';

const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors');

const config: Config = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        green: colors.green,
        lime: colors.lime,
        red: colors.red,
        rose: colors.rose,
        yellow: colors.yellow,
        softYellow: '#fefaa6',
        purple: colors.purple,
        indigo: colors.indigo,
        orange: colors.orange,
        amber: colors.amber,
        blue: colors.blue,
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
        zinc: colors.zinc
		
      },
      fontSize: {
        xs: '0.75rem',
      },
      width: {
        '1/10': '10%', // 1/16 width
      }
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
});
export default config;
