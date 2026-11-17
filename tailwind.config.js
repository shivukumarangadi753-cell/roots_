/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#244C3A', // Deep forest green
          hover: '#1b3a2c',
          light: '#2d5e48',
          subtle: '#eaf0ec',
        },
        sage: {
          DEFAULT: '#819783', // Muted sage
          light: '#b6c5b7',
          subtle: '#eef3ef',
        },
        bg: {
          DEFAULT: '#F7F7F2', // Warm off-white
          subtle: '#F0F0EA',
        },
        surface: '#FFFFFF', // Pure white
        charcoal: {
          DEFAULT: '#252B27', // Dark charcoal
          light: '#3e4640',
        },
        muted: '#747B75', // Muted grey
        border: {
          DEFAULT: '#E3E8E2', // Light grey-green
          dark: '#c8d1c6',
        },
        olive: {
          DEFAULT: '#A3A77A', // Earthy olive
          light: '#d0d3b6',
          subtle: '#f4f5ee',
        },
      },
      fontFamily: {
        heading: ['"Manrope"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(36, 76, 58, 0.05)',
        'card': '0 2px 6px rgba(36, 76, 58, 0.06)',
      }
    },
  },
  plugins: [],
};
