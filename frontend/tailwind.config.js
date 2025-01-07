/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        'pink': {
          '400': '#F472B6',
          '500': '#EC4899'
        },
        'violet': {
          '50': '#F5F3FF',
          '500': '#8B5CF6'
        },
        'zinc': {
          '50': '#FAFAFA',
          '100': '#F4F4F5',
          '300': '#D4D4D8',
          '400': '#A1A1AA',
          '500': '#71717A',
          '600': '#52525B',
          '800': '#27272A',
          '900': '#18181B',
          '950': '#09090B'
        }
      },
    },
  },

}

