/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blkout: {
          primary: '#D4261A',      // Bold red
          secondary: '#F4A261',    // Warm gold  
          accent: '#2A9D8F',       // Teal
          warm: '#E76F51',         // Orange
          deep: '#264653',         // Forest green
        },
        realness: {
          amber: '#F59E0B',
          orange: '#EA580C', 
          rose: '#E11D48',
          purple: '#7C3AED',
        },
        pride: {
          red: '#E40303',
          orange: '#FF8C00', 
          yellow: '#FFED00',
          green: '#008018',
          blue: '#004CFF',
          purple: '#732982',
          pink: '#FFB3DA',
          cyan: '#00D4FF',
          black: '#000000'
        }
      },
      backgroundImage: {
        'function-ai': 'linear-gradient(to bottom right, rgb(17 94 89), rgb(6 78 59), rgb(15 23 42))',
        'function-community': 'linear-gradient(to bottom right, rgb(120 53 15), rgb(154 52 18), rgb(127 29 29))',
        'function-news': 'linear-gradient(to bottom right, rgb(15 23 42), rgb(17 24 39), rgb(23 37 84))',
        'function-governance': 'linear-gradient(to bottom right, rgb(59 7 100), rgb(76 5 82), rgb(67 56 202))',
        'function-liberation': 'linear-gradient(135deg, rgb(124 58 237), rgb(225 29 72), rgb(245 158 11), rgb(16 185 129))'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pride-wave': 'prideWave 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        prideWave: {
          '0%, 100%': { 
            background: 'linear-gradient(45deg, #E40303, #FF8C00, #FFED00, #008018, #004CFF, #732982)'
          },
          '50%': { 
            background: 'linear-gradient(225deg, #732982, #004CFF, #008018, #FFED00, #FF8C00, #E40303)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}