import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/miwifi-card.ts",
  output: {
    file: "dist/miwifi-card.js",
    format: "iife",
    name: "MiWiFiCard",
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    terser({ format: { comments: false } }),
  ],
};
