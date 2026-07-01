import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // `../public` is copied verbatim into the build output. It ships the
  // Cloudflare Pages `_redirects` guard that forces missing asset/chunk/font
  // requests to a REAL 404 instead of the SPA-fallback HTML that once
  // amplified a single 404 into an infinite fetch loop (see public/_redirects
  // and src/styles/fonts.css for the full incident write-up).
  staticDirs: ["../public"],
  // Storybook 9 consolidated the old "essentials" bundle (controls, actions,
  // viewport, backgrounds, toolbars, measure, outline, highlight) into the
  // core — so `@storybook/addon-essentials` no longer exists and is dropped.
  // `docs` was split back out into its own `@storybook/addon-docs` package,
  // which we add explicitly to keep autodocs working.
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      css: {
        postcss: {
          plugins: [],
        },
      },
    });
  },
};

export default config;
