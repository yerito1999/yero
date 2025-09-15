import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Game specific colors
        love: {
          start: "var(--love-gradient-start)",
          middle: "var(--love-gradient-middle)", 
          end: "var(--love-gradient-end)",
        },
        glow: {
          pink: "var(--glow-pink)",
          gold: "var(--glow-gold)",
        },
        game: {
          bg: {
            start: "var(--game-bg-start)",
            middle: "var(--game-bg-middle)",
            end: "var(--game-bg-end)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["Georgia", "serif"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        cowFloat: {
          "0%, 100%": { transform: "translateY(-50%) scale(1)" },
          "50%": { transform: "translateY(-65%) scale(1.03)" },
        },
        cowShoot: {
          "0%": { transform: "translateY(-50%) scale(1) rotate(0deg)" },
          "25%": { transform: "translateY(-50%) scale(1.1) rotate(-3deg)" },
          "50%": { transform: "translateY(-50%) scale(0.95) rotate(3deg)" },
          "100%": { transform: "translateY(-50%) scale(1) rotate(0deg)" },
        },
        cowCelebrate: {
          "0%, 100%": { transform: "translateY(-50%) scale(1) rotate(0deg)" },
          "25%": { transform: "translateY(-50%) scale(1.15) rotate(-8deg)" },
          "50%": { transform: "translateY(-50%) scale(1.05) rotate(0deg)" },
          "75%": { transform: "translateY(-50%) scale(1.15) rotate(8deg)" },
        },
        titlePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        pulseGlow: {
          from: { 
            transform: "scale(1)",
            textShadow: "0 0 10px var(--glow-gold)",
          },
          to: { 
            transform: "scale(1.05)",
            textShadow: "0 0 20px var(--glow-gold)",
          },
        },
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        floatUp: {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-100px) scale(0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        twinkle: "twinkle 3s ease-in-out infinite",
        cowFloat: "cowFloat 3s ease-in-out infinite",
        cowShoot: "cowShoot 0.4s ease-out",
        cowCelebrate: "cowCelebrate 0.8s ease-in-out infinite",
        titlePulse: "titlePulse 2s ease-in-out infinite",
        pulseGlow: "pulseGlow 0.6s ease-in-out infinite alternate",
        shimmer: "shimmer 2s infinite",
        floatUp: "floatUp 2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
