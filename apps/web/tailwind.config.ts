
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/*/{src,dist}/**/*.{ts,tsx}",
  ],
  exclude: [
    "**/node_modules/**"
  ],
  presets: [{
    content: ["./src/**/*.tsx"],
    darkMode: "class",
    prefix: "",
    safelist: [
      'object-cover', 'object-contain', 'object-fill', 'object-none',
      'object-scale-down',
    ],
    plugins: [
      require("tailwindcss-animate"),
      require('@tailwindcss/typography'),
    ],
  }],
  theme: {
    extend: {
    },
  },
} 

