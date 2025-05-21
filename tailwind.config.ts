import type { Config } from "tailwindcss";
import * as path from "path";
import * as fs from "fs";

const libsBase = path.resolve(__dirname, "../");
const dynLibs = fs.readdirSync(libsBase);

export type BuildProps = {
  libraries: string[];
  /** **Only use this as a last resort!** all configs should ultimately end up in the ui library itself */
  extend(
    extend: Exclude<Config["theme"], undefined>["extend"]
  ): Exclude<Config["theme"], undefined>["extend"];

  /** default is `['src']` the content directories where the files reside */
  contentDirs: string[];
};

const resolveLib = (library: string) => [
  path.resolve(libsBase, library, "dist", "*.{js,jsx,ts,tsx}"),
  path.resolve(libsBase, library, "dist", "**/*.{js,jsx,ts,tsx}"),
];

export const BuildConfig = ({
  libraries = [],
  extend = (e) => e,
  contentDirs = ["src"],
}: Partial<BuildProps> = {}): Config => ({
  content: [
    ...contentDirs.map((dir) => `${dir}/**/*.{js,jsx,ts,tsx}`),
    ...[...new Set([...libraries, ...dynLibs])].flatMap(resolveLib),
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
      center: true,
      screens: {
        xl: "1034px",
      },
    },
    extend: extend({
      keyframes: {
        "stepped-spin": {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "stepped-spin":
          "stepped-spin 0.75s cubic-bezier(0.3, 0.39, 0.23, 0.77) infinite",
      },
      boxShadow: {
        // 'modal': `0 1px 0 rgba(255, 255, 255, 0.12), 0 3px 8px rgba(0, 0, 0, 0.04), 0 32px 64px rgba(0, 0, 0, 0.04)`,
        modal: [
          // `0 1px 0 rgba(255, 255, 255, 0.12)`,
          "0px 32px 64px 0px rgba(0, 0, 0, 0.3)",
          // `0 3px 8px rgba(0, 0, 0, 0.04)`,
          "0px 3px 8px 0px rgba(0, 0, 0, 0.04)",
          // `0 32px 64px rgba(0, 0, 0, 0.04)`
          "0px 1px 0px 0px rgba(255, 255, 255, 0.12) inset",
        ],
        material: [
          "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
          "0px 1px 0px 0px rgba(255, 255, 255, 0.12) inset",
        ],
        "material-inset": "0px 1px 2px 0px rgba(0, 0, 0, 0.2) inset",
        "modal-head": `0px 1px 2px 0px rgba(0, 0, 0, 0.08)`,
        table: [
          "0px 0px 12px 0px rgba(0, 0, 0, 0.46) inset",
          "0px 12px 0px 0px rgba(0, 0, 0, 0.32)",
        ],
        "table-rim": [
          "0px 0px 12px 0px rgba(0, 0, 0, 0.42)",
          "0px 4px 4px 0px rgba(0, 0, 0, 0.12)",
        ],
        "table-bump": [
          "0px -14px 28px 0px rgba(255, 255, 255, 0.16) inset",
          "0px 14px 28px 0px rgba(0, 0, 0, 0.16) inset",
        ],
        "card-floating": "0px 2.82px 18.77px 0px rgba(0, 0, 0, 0.3)",
        "card-laying": "0px 1px 1px 0px rgba(0, 0, 0, 0.3)",
        "card-slot": [
          "0px 1px 0px 0px rgba(0, 0, 0, 0.12) inset",
          "0px 1px 2px 0px rgba(255, 255, 255, 0.12)",
        ],
        "weird-knob": "12px 12px 24px 0px rgba(0, 0, 0, 0.3)",

        "inner-ultra-light-outer-thick-1": [
          "0px 1px 0px 0px #FFFFFF14 inset",
          "0px 1px 1px rgba(0, 0, 0, 0.3)",
        ],
        "inner-ultra-light-outer-thick-2": [
          "0px 1px 0px 0px #FFFFFF14 inset",
          "0px 1px 1px 0px #0000004D",
        ],
        "inner-ultra-light-regular-default": [
          "0px 1px 0px 0px #FFFFFF14 inset",
          "0px 1px 2px 0px #0000001F",
        ],
        "inner-light-regular-default": [
          "0px 1px 0px 0px #FFFFFF1F inset",
          "0px 1px 2px 0px #0000001F",
        ],
        "inner-ultra-light-outer-huge-float": [
          "0px 1px 0px 0px #FFFFFF14 inset",
          "0px 32px 64px 0px #0000004D",
        ],
        "outer-regular-wide": "0px 3px 8px 0px #0000001F",

        "switch-box": "0px 1px 4px 0px #00000033 inset",
        "switch-box-knob": [
          "0px 1px 2px 0px #00000066",
          "0px 1px 0px 0px #FFFFFF inset",
          "0px 8px 16px 0px #00000040",
        ],
      },
      aspectRatio: {
        card: "58 / 81.2",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      colors: {
        neutral: {
          100: "#FFFFFF",
          200: "#EDEDED",
          300: "#808080",
          400: "#1D1D1D",
          500: "#000000",
        },
        green: {
          400: "#30DB5B",
          500: "#1EC748",
        },
        red: {
          400: "#FF6861",
          500: "#F83A2E",
        },
        purple: {
          400: "#DA8FFF",
          500: "#BF5AF2",
        },
        yellow: {
          500: "#FFD50B",
        },
        blue: {
          // 500: "#64D3FF",
        },
        orange: {
          500: "#F05A22",
        },
        material: {
          "main-1": "rgba(255, 255, 255, 0.08)",
          "main-2": "rgba(255, 255, 255, 0.12)",
          "main-3": "rgba(255, 255, 255, 0.24)",
          placeholder: "rgba(255, 255, 255, 0.3)",
          "medium-1": "rgba(255, 255, 255, 0.4)",
          "medium-2": "rgba(255, 255, 255, 0.5)",
          "medium-3": "rgba(255, 255, 255, 0.6)",
          "heavy-1": "rgba(255, 255, 255, 0.7)",
          "heavy-2": "rgba(255, 255, 255, 0.8)",
          "heavy-3": "rgba(255, 255, 255, 0.9)",
          diabolical: "rgba(255, 255, 255)",
        },
      },
      borderRadius: {
        xl: "12px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "song-myung": ["Song Myung", "serif"],
      },
      transitionProperty: {
        border: "border",
      },
      screens: {
        "h-md": {
          raw: "(min-height: 768px)",
        },
      },
    }),
  },
  plugins: [],
});

export default BuildConfig();
