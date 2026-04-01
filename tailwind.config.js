/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#020617',
          surface: '#0f172a',
          elevated: '#1e293b',
          primary: '#06b6d4',
          secondary: '#6366f1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#f43f5e',
          text: '#f8fafc',
          muted: '#94a3b8',
        },
      },
      boxShadow: {
        glow: '0 18px 48px rgba(6, 182, 212, 0.18)',
        elevate: '0 24px 64px rgba(2, 8, 23, 0.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-correct': 'pulseCorrect 0.8s ease-out',
        'shake-wrong': 'shakeWrong 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseCorrect: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(16, 185, 129, 0)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.14)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(16, 185, 129, 0)' },
        },
        shakeWrong: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
};
