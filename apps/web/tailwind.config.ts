
import sharedConfig from "@repo/config/tailwind";
import type { Config } from "tailwindcss";
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/*/{src,dist}/**/*.{ts,tsx}",
  ],
  exclude: [
    "**/node_modules/**"
  ],
  presets: [sharedConfig],
  extend: {
  },
} as Pick<Config, "content" | "presets" | "extend"> 

