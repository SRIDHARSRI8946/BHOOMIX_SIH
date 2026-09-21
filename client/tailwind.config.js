/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0f172a", // slate-900 / emerald / deep navy accent
          hover: "#1e293b",
          foreground: "#ffffff",
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
