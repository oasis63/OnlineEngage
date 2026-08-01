import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: '#121215',
        border: '#27272a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
