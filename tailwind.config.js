/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'ibm-plex': ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        'cyber-blue': '#00e5ff',
        'cyber-purple': '#8a2be2',
        'cyber-indigo': '#5b86e5',
        'dark-purple': '#43087a',
        'light-purple': '#9048ee',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 1.5s ease-out',
        'bg-slide-in': 'bgSlideIn 2s ease-in-out forwards',
      },
      keyframes: {
        glowPulse: {
          '0%': { textShadow: '0 0 30px rgba(0, 255, 255, 0.5)' },
          '100%': { textShadow: '0 0 50px rgba(0, 255, 255, 0.8), 0 0 70px rgba(0, 255, 255, 0.3)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bgSlideIn: {
          '0%': { backgroundPosition: '100% 0', opacity: '0' },
          '100%': { backgroundPosition: '50% 0', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 