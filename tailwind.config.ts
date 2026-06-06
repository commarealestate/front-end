/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./common/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
    },
    extend: {
      colors: {
        comma: {
          // Primary - Deep Burgundy for luxury
          primary: {
            light: "#B43E66",
            DEFAULT: "#8E084D", // Main brand color
            dark: "#5C0431",
            subtle: "#FFF0F7",
          },
          
          // Secondary - Gold accents for premium feel
          secondary: {
            light: "#E6B45E",
            DEFAULT: "#D4A346", // Gold for luxury
            dark: "#B88734",
          },
          
          // Neutrals - Sophisticated palette
          neutral: {
            50: "#FAF9F8",
            100: "#F5F3F2",
            200: "#E9E7E6",
            300: "#D6D2D0",
            400: "#A8A29E",
            500: "#78716C",
            600: "#57534E",
            700: "#44403C",
            800: "#292524",
            900: "#1C1917",
          },
          
          // Surface colors
          surface: {
            base: "#FFFFFF",
            elevated: "#FAF9F8",
            subtle: "#F5F3F2",
          },
          
          // Border colors
          border: {
            subtle: "#E9E7E6",
            strong: "#D6D2D0",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"], // Luxury serif for headings
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(142, 8, 77, 0.08)',
        'hover': '0 30px 60px rgba(142, 8, 77, 0.12)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};