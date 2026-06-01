import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1015",
        parchment: "#F3EADB",
        ember: "#EE6C4D",
        moss: "#71927A",
        brass: "#B68C3B",
        slate: "#1B2733",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(11, 16, 21, 0.16)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(243,234,219,0.25), transparent 35%), linear-gradient(135deg, rgba(182,140,59,0.12), transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
