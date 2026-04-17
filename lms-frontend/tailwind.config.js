/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#121212',
        cloud: '#f5f7fb',
        paper: '#ffffff',
        ocean: {
          50: '#eef3ff',
          500: '#3f6fe8',
          600: '#2f5bd6',
          700: '#244bb1',
        },
        accent: {
          DEFAULT: '#f6d84b',
          soft: '#fff2b6',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        ink: '4px 4px 0 0 #121212',
        'ink-sm': '2px 2px 0 0 #121212',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-1px)' },
        },
      },
      animation: {
        rise: 'rise 600ms ease-out both',
      },
    },
  },
  plugins: [],
}
