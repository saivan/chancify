import sharedConfig from "@repo/config/tailwind"
import type { Config } from "tailwindcss"


export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/*/{src,dist}/**/*.{ts,tsx}",
  ],
  exclude: [
    "**/node_modules/**"
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
    },
  },
} satisfies Config;

