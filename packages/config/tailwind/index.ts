import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from 'tailwindcss/plugin';


export default {
  content: ["./src/**/*.tsx"],
  darkMode: ["class"],
  prefix: "",
  fontFamily: {
    sans: ["var(--font-sans)", ...fontFamily.sans],
  },
  safelist: [
    'object-cover', 'object-contain', 'object-fill', 'object-none',
    'object-scale-down',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "<2xl": { max: "1535px" },
        "<xl": { max: "1279px" },
        "<lg": { max: "1023px" },
        "<md": { max: "767px" },
        "<sm": { max: "424px" },
        ">sm": "425px",
        ">md": "768px",
        ">lg": "1024px",
        ">xl": "1280px",
        ">2xl": "1536px",
        sm: "425px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '256': '64rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            blockquote: {
              quotes: 'none',
              '&::before': {
                content: 'none',
              },
              '&::after': {
                content: 'none',
              },
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            table: {
              borderCollapse: 'separate',
              borderSpacing: '0',
            },
            thead: {
              backgroundColor: 'transparent',
            },
            th: {
              border: 'none',
              padding: '0',
            },
            td: {
              border: 'none',
              padding: '0',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),

    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    }),
  ],
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))',
  },
} as Config;


const hexToHSL = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find min and max values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  // Calculate HSL values
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0));
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
  }
  
  // Round values
  h = Math.round(h * 10) / 10;
  s = Math.round(s * 1000) / 10;
  l = Math.round(l * 1000) / 10;
  
  return `${h} ${s}% ${l}%`;
};

const extractColorVars = (
  colorObj: Record<string, any>,
  colorGroup: string = '',
): Record<string, string> => {
  return Object.keys(colorObj).reduce((vars, colorKey) => {
    const value = colorObj[colorKey];
    
    if (typeof value === 'string' && value.startsWith('#')) {
      return {
        ...vars,
        [`--color${colorGroup}-${colorKey}`]: value,
        [`--color-hsl${colorGroup}-${colorKey}`]: hexToHSL(value)
      };
    }
    
    if (typeof value === 'object') {
      return {
        ...vars,
        ...extractColorVars(value, `-${colorKey}`)
      };
    }
    
    return vars;
  }, {});
};
