/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        /** Letreiro / pôster — presença máxima no hero */
        rock: ["Rye", "ui-serif", "Georgia", "serif"],
        /** Marquee, rótulos em caixa alta */
        heading: ["Oswald", "ui-sans-serif", "system-ui", "sans-serif"],
        /** Micro-legendas (tracking largo) */
        display: ["Oswald", "ui-sans-serif", "system-ui", "sans-serif"],
        /** Corpo — texto editorial */
        body: ["Libre Baskerville", "ui-serif", "Georgia", "serif"],
        /** Citações / notas editoriais */
        serif: ["Libre Baskerville", "ui-serif", "Georgia", "serif"],
        title: ["Libre Baskerville", "serif"],
      },
      fontSize: {
        /** OPSZ explícito DM Sans quando útil */
        "body-sm": ["0.9375rem", { lineHeight: "1.75" }],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 42px rgba(244, 224, 77, 0.22)",
        "glow-sm": "0 0 24px rgba(244, 224, 77, 0.14)",
        cherry: "0 18px 48px rgba(159, 34, 51, 0.25)",
        inset: "inset 0 1px 0 rgba(255,245,220,0.06)",
      },
      colors: {
        cream: "#e8dcc4",
        paper: "#f2e8d5",
        gold: "#c9a227",
        wine: "#2c0a10",
        cocoa: "#141210",
        ink: "#050403",
        cd: {
          base: "#220C10",
          void: "#080706",
          deep: "#060504",
          rise: "#12100e",
          panel: "#161311",
          lift: "#1c1916",
          mist: "#ede4d4",
          wash: "#c4b8a5",
          muted: "#8a8074",
          faint: "#585046",
          gold: "#c9a227",
          goldhi: "#dfc056",
          golddim: "#8a7020",
          cherry: "#9f2233",
          cherryhi: "#c42d42",
          wine: "#2c0a10",
          neon: "#f4e04d",
          teal: "#7A1321",
          tealdeep: "#501019",
          warn: "#c45c4e",
        },
      },
      keyframes: {
        "disc-fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cd-overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "cd-panel-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cd-row-flash": {
          "0%": { backgroundColor: "rgba(201, 162, 39, 0.14)" },
          "100%": { backgroundColor: "rgba(201, 162, 39, 0)" },
        },
        "press-sheet-in": {
          "0%": { opacity: "0", transform: "translateX(18px) rotate(1.4deg)" },
          "100%": { opacity: "1", transform: "translateX(0) rotate(0.9deg)" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
        "marquee-shine": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "disc-fade-up": "disc-fade-up 0.75s ease-out both",
        "cd-overlay-in": "cd-overlay-in 0.45s ease-out both",
        "cd-panel-in": "cd-panel-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "cd-row-flash": "cd-row-flash 1.8s ease-out both",
        "press-sheet-in": "press-sheet-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both",
        "neon-pulse": "neon-pulse 4s ease-in-out infinite",
        "marquee-shine": "marquee-shine 8s linear infinite",
        marquee: "marquee 140s linear infinite",
      },
      backgroundImage: {
        "chrome-bar":
          "linear-gradient(180deg, rgba(232,220,196,0.14) 0%, rgba(80,74,64,0.06) 45%, rgba(0,0,0,0.22) 100%)",
        "vinyl-groove":
          "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, rgba(255,245,220,0.04) 2px, rgba(255,245,220,0.04) 3px)",
      },
    },
  },
  plugins: [],
};
