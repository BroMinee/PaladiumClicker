// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxHeight: {
        '120': '30rem',
        '100': '25rem',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
      },
      backgroundImage: {
        'light': "url('/background_light.webp')",
        'dark': "url('/background_dark.webp')",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mc: ["Pixel NES", "sans-serif"],
      },
      colors: {
        dynamic: 'var(--dynamic-color)',
        chaos: '#93fb37',
        order: '#FAEC55',
        discord: "#5865f2",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        'primary-darker': {
          DEFAULT: "hsl(var(--primary-darker))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "falling": {
          from: {
            opacity: "1",
            transform: "translateY(-100%) rotateZ(0deg)",
          },
          to: {
            opacity: "0",
            transform: "translateY(100dvh) rotateZ(360deg)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        blink: {
          '0%, 100%': { color: '#f87171' },
          '50%': { color: '#ffffff' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "falling": "falling 3s linear infinite",
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        blink: 'blink 1s infinite',
      },
      addUtilities: {
        '.pixelated': {
          'image-rendering': 'pixelated',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.pixelated': {
          'image-rendering': 'pixelated',
        },
      });
    }],
};
export default config;
