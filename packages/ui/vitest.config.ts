import { defineConfig } from "vitest/config";
import path from "path";

const rootNodeModules = path.resolve(__dirname, "../../node_modules");

export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(rootNodeModules, "react"),
      "react-dom": path.resolve(rootNodeModules, "react-dom"),
      "react/jsx-dev-runtime": path.resolve(rootNodeModules, "react/jsx-dev-runtime"),
      "react/jsx-runtime": path.resolve(rootNodeModules, "react/jsx-runtime"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
