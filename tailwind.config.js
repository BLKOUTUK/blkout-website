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
          primary: '#FF0055',      // Electric magenta - BOLD
          secondary: '#00FFFF',    // Electric cyan - SHARP  
          accent: '#7B68EE',       // Electric indigo - CONFIDENT
          warm: '#FF6B35',         // Electric orange - ENERGY
          deep: '#0A0A0A',         // True black - POWER
          neon: '#39FF14',         // Laser green - DISRUPTION
        },
        electric: {
          // Zone-specific colors for intentional project area distinction
          pink: '#FF1493',         // Electric pink
          blue: '#0080FF',         // Neon blue
          green: '#39FF14',        // Laser green
          magenta: '#FF0055',      // Hot magenta
          indigo: '#4B0082',       // Deep indigo
          cyan: '#00FFFF',         // Cyber cyan
          orange: '#FF6B00',       // Volt orange
          purple: '#8A2BE2',       // Plasma purple
        },
        zones: {
          // Distinct color zones for different project areas
          community: {
            primary: '#FF0055',    // Electric magenta
            secondary: '#FF1493',  // Deep pink
            accent: '#8A2BE2',     // Blue violet
            bg: '#1a0a14'          // Dark magenta base
          },
          technology: {
            primary: '#00FFFF',    // Electric cyan
            secondary: '#0080FF',  // Electric blue
            accent: '#4169E1',     // Royal blue
            bg: '#0a1419'          // Dark cyan base
          },
          liberation: {
            primary: '#7B68EE',    // Electric indigo
            secondary: '#9370DB',  // Medium slate blue
            accent: '#6A5ACD',     // Slate blue
            bg: '#0f0a19'          // Dark indigo base
          },
          disruption: {
            primary: '#39FF14',    // Laser green
            secondary: '#00FF7F',  // Spring green
            accent: '#32CD32',     // Lime green
            bg: '#0a190a'          // Dark green base
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Oswald', 'Impact', 'Arial Black', 'sans-serif'], // Bold, masculine display font
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
        'heading': ['Montserrat', 'Arial Black', 'sans-serif'], // Strong headings
        'electric': ['Orbitron', 'Courier New', 'monospace'] // Futuristic/tech font
      },
      fontSize: {
        // Larger, bolder text sizes for confident masculine aesthetic
        'electric': ['5rem', { lineHeight: '1', fontWeight: '900' }],
        'massive': ['8rem', { lineHeight: '0.9', fontWeight: '900' }],
        'giant': ['12rem', { lineHeight: '0.8', fontWeight: '900' }],
      },
      fontWeight: {
        'electric': '900', // Maximum boldness
        'ultra': '950',    // Even bolder if supported
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