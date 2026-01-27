/**
 * Scrollytelling - Tailwind Configuration
 *
 * Uses @blkout/shared preset for consistent design system.
 * App-specific cooperative colors for narrative experiences.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Use shared BLKOUT design system
  presets: [require('../../packages/shared/tailwind.preset')],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // App-specific: Cooperative green spectrum for storytelling
      colors: {
        cooperative: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}