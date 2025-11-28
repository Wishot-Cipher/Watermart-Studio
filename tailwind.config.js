// tailwind.config.js — design system tokens
import { defineConfig } from 'tailwindcss'
import forms from '@tailwindcss/forms'

// Merged Tailwind config — preserves previous image-editing styles + new design tokens
export default defineConfig({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        slab: ['Roboto Slab', 'serif'],
        script: ['Pacifico', 'cursive']
      },

      // --- Original brand & neutral palettes (useful for image editing UI)
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },

      // --- New design tokens from your spec (primary/secondary/accent/background/text/semantic)
      primary: {
        DEFAULT: '#1A7CFF',
        hover: '#0D6EF5',
        active: '#0558CC',
        light: 'rgba(26,124,255,0.1)',
        medium: 'rgba(26,124,255,0.3)'
      },
      secondary: {
        DEFAULT: '#18E2FF',
        glow: 'rgba(24,226,255,0.4)',
        light: '#5CEEFF'
      },
      accent: {
        DEFAULT: '#A24BFF',
        vibrant: '#B366FF',
        subtle: 'rgba(162,75,255,0.15)'
      },
      background: {
        deep: '#000913',
        elevated: '#031B2F',
        card: '#0A2540',
        cardHover: '#0F2F50',
        glass: 'rgba(255,255,255,0.05)'
      },
      border: {
        subtle: 'rgba(255,255,255,0.08)',
        bright: 'rgba(26,124,255,0.3)'
      },
      text: {
        primary: '#F4F8FF',
        secondary: '#9FB2C8',
        tertiary: '#5A7089',
        disabled: '#3A4A5C'
      },
      success: '#10D98E',
      successLight: 'rgba(16,217,142,0.15)',
      warning: '#FFB020',
      warningLight: 'rgba(255,176,32,0.15)',
      error: '#FF5C5C',
      errorLight: 'rgba(255,92,92,0.15)',
      info: '#1A7CFF',
      infoLight: 'rgba(26,124,255,0.15)',

      // --- Animations & keyframes from original config
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut: { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },

      // --- Shadows and radii
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevated': '0 20px 60px rgba(0,0,0,0.5)'
      },

      borderRadius: {
        lg: '16px',
        xl: '24px',
        full: '999px'
      },

      fontSize: {
        'display-xl': ['64px', { lineHeight: '72px', fontWeight: '700' }],
        'display-l': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'display-m': ['40px', { lineHeight: '48px', fontWeight: '600' }],
        'h1': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
    }
  },

  plugins: [
    forms,

    // watermark blend utilities from original config
    function({ addUtilities }) {
      const watermarkUtilities = {
        '.watermark-blend-soft': {
          'mix-blend-mode': 'soft-light',
          'opacity': '0.85',
        },
        '.watermark-blend-overlay': {
          'mix-blend-mode': 'overlay',
          'opacity': '0.9',
        },
        '.watermark-blend-screen': {
          'mix-blend-mode': 'screen',
          'opacity': '0.75',
        },
        '.watermark-blend-multiply': {
          'mix-blend-mode': 'multiply',
          'opacity': '0.8',
        },
        '.watermark-adaptive-dark': {
          'mix-blend-mode': 'difference',
          'filter': 'invert(1)',
          'opacity': '0.85',
        },
        '.watermark-adaptive-light': {
          'mix-blend-mode': 'multiply',
          'opacity': '0.7',
        },
      }
      addUtilities(watermarkUtilities)
    },

    // glass morphism utilities from original config
    function({ addUtilities }) {
      const glassMorphism = {
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(10px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(10px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(10px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
        },
      }
      addUtilities(glassMorphism)
    },

    // small utilities for gradients/glass used in components
    ({ addUtilities }) => {
      const utilities = {
        '.primary-gradient': {
          backgroundImage: 'linear-gradient(135deg, #1A7CFF 0%, #A24BFF 100%)'
        },
        '.glow-gradient': {
          backgroundImage: 'linear-gradient(135deg, #18E2FF 0%, #1A7CFF 50%, #A24BFF 100%)'
        },
        '.glass-strong': {
          background: 'linear-gradient(135deg, rgba(26,124,255,0.1) 0%, rgba(162,75,255,0.05) 100%)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }
      addUtilities(utilities, { variants: ['responsive', 'hover'] })
    }
  ]
})
