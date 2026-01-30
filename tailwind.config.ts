import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Design Tokens
        champagne: '#F2E6D8',
        sand: '#E8D5C2',
        rosegold: '#C89A7A',
        softgold: '#E6C9A8',
        pearl: '#F7F6F3',
        warmbrown: '#5A3E2B',
        taupe: '#8B6F5A',
        
        // Legacy aliases (backward compatibility)
        'warm-beige': '#F2E6D8',
        'warm-beige-light': '#F7F6F3',
        'warm-beige-lighter': '#F7F6F3',
        'warm-cream': '#F7F6F3',
        'secondary-bg': '#E8D5C2',
        'gold-accent': '#C89A7A',
        'gold-dark': '#B8916B',
        'gold-darker': '#A67B5B',
        'text-primary': '#5A3E2B',
        'text-secondary': '#5A3E2B',
        'text-light': '#FFFFFF',
        'text-muted': '#8B6F5A',
        'btn-primary': '#C89A7A',
        'btn-primary-hover': '#B8916B',
        'btn-secondary': '#FFFFFF',
        'border-primary': '#E6C9A8',
        'border-light': '#E8D5C2',
        'footer-bg': '#5A3E2B',
        'footer-bg-dark': '#3A2D25',
        'footer-accent': '#C89A7A',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Poppins', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.05em',
        'wide': '0.1em',
      },
      transitionDuration: {
        '600': '600ms',
        '800': '800ms',
      },
      boxShadow: {
        'luxury': '0 10px 30px rgba(200, 154, 122, 0.15)',
        'luxury-lg': '0 20px 40px rgba(200, 154, 122, 0.2)',
        'sm': '0 4px 12px rgba(200, 154, 122, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config
