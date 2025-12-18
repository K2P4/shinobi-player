module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        naruto: {
          orange: "#FF9900",
          "orange-dark": "#FF6600",
          charcoal: "#121212",
          "charcoal-light": "#1a1a1a",
          chakra: "#3B82F6",
          leaf: "#22C55E",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
};
