/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-on-surface": "#f5f0eb",
        "surface-dim": "#ded9d4",
        "inverse-surface": "#32302d",
        "background": "#fef8f3",
        "tertiary-fixed": "#ffdad5",
        "tertiary-container": "#560001",
        "on-primary-container": "#988b84",
        "primary-container": "#2d2520",
        "on-surface-variant": "#4e4540",
        "tertiary": "#2f0000",
        "on-primary-fixed": "#211a15",
        "surface-variant": "#e6e2dd",
        "on-secondary-container": "#785d4b",
        "primary-fixed-dim": "#d2c4bc",
        "outline": "#7f756f",
        "on-primary-fixed-variant": "#4e453f",
        "surface-container-highest": "#e6e2dd",
        "secondary-fixed": "#ffdcc5",
        "surface-bright": "#fef8f3",
        "outline-variant": "#d1c4bd",
        "inverse-primary": "#d2c4bc",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "on-background": "#1d1b19",
        "on-tertiary-fixed": "#410001",
        "secondary": "#735947",
        "on-tertiary-container": "#eb6151",
        "surface-container": "#f2ede8",
        "surface-container-high": "#ece7e2",
        "on-secondary": "#ffffff",
        "on-surface": "#1d1b19",
        "tertiary-fixed-dim": "#ffb4a9",
        "surface-container-low": "#f8f3ee",
        "primary": "#17110c",
        "surface-tint": "#675c56",
        "primary-fixed": "#efe0d8",
        "on-error": "#ffffff",
        "surface": "#fef8f3",
        "error": "#ba1a1a",
        "on-tertiary-fixed-variant": "#8a1b13",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#e2c0aa",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "margin-mobile": "24px",
        "base": "8px",
        "gutter": "24px",
        "margin-desktop": "64px",
        "section-gap": "120px"
      },
      fontFamily: {
        "headline-lg": ["Playfair Display", "serif"],
        "label-sm": ["Lato", "sans-serif"],
        "display-lg-mobile": ["Playfair Display", "serif"],
        "display-lg": ["Playfair Display", "serif"],
        "body-lg": ["Lato", "sans-serif"],
        "headline-md": ["Playfair Display", "serif"],
        "body-md": ["Lato", "sans-serif"],
        "sans": ["Lato", "sans-serif"],
        "serif": ["Playfair Display", "serif"]
      }
    }
  },
  plugins: [],
}
