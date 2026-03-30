import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        mint: {
          50: "#f0f9f3",
          100: "#E8F3EC",
          200: "#d0e8d9",
          300: "#A8CBB7",
          400: "#7dab90",
          500: "#6D8B74",
          600: "#537060",
          700: "#3f574a",
          800: "#2c3e35",
          900: "#1a2620",
        },
        peach: {
          100: "#fdf0ea",
          200: "#F6C1A6",
          300: "#f0a07a",
          400: "#e8814e",
        },
        spa: {
          bg: "#E8F3EC",
          green: "#A8CBB7",
          accent: "#6D8B74",
          peach: "#F6C1A6",
          text: "#1F2A2E",
          muted: "#5a6e73",
          light: "#f7fbf8",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
        accent: ["var(--font-satisfy)", "cursive"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        soft: "8px 8px 24px rgba(168,203,183,0.25), -4px -4px 12px rgba(255,255,255,0.8)",
        "soft-sm": "4px 4px 12px rgba(168,203,183,0.2), -2px -2px 8px rgba(255,255,255,0.7)",
        "soft-lg": "12px 12px 40px rgba(168,203,183,0.3), -6px -6px 20px rgba(255,255,255,0.9)",
        inset: "inset 4px 4px 8px rgba(168,203,183,0.2), inset -2px -2px 6px rgba(255,255,255,0.8)",
        peach: "0 8px 32px rgba(246,193,166,0.3)",
        green: "0 8px 32px rgba(109,139,116,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        ripple: "ripple 1.5s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "slide-in": "slideIn 0.6s ease-out forwards",
        breathe: "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      backgroundImage: {
        "gradient-mint": "linear-gradient(135deg, #E8F3EC 0%, #d0e8d9 50%, #f7fbf8 100%)",
        "gradient-soft": "linear-gradient(180deg, #E8F3EC 0%, #f7fbf8 100%)",
        "gradient-peach": "linear-gradient(135deg, #fdf0ea 0%, #F6C1A6 100%)",
        "gradient-hero": "linear-gradient(to bottom, rgba(232,243,236,0.7) 0%, rgba(247,251,248,0.9) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
