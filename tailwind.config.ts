import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'special-elite': ['"Special Elite"', 'monospace'],
      },
      colors: {
        'mission-red': '#8B0000',
        'mission-gold': '#C9A227',
        'terminal-green': '#00FF41',
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'typewriter': 'typewriter 0.1s steps(1) forwards',
        'static': 'static 0.5s steps(10) infinite',
        'envelope-open': 'envelope-open 0.8s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        static: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'envelope-open': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(180deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
