import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import * as parser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        // React
        React: true,
        JSX: true,

        // Browser
        window: true,
        document: true,
        navigator: true,
        location: true,
        history: true,
        localStorage: true,
        sessionStorage: true,
        console: true,
        
        // Timers
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        
        // DOM
        HTMLElement: true,
        Element: true,
        Event: true,
        
        // Web APIs
        fetch: true,
        Request: true,
        Response: true,
        Headers: true,
        FormData: true,
        
        // Next.js specific
        process: true,
        crypto: true,
        
        // Testing
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": nextPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
];
