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
  // 🚫 NO Docs pages. storybook.devfellowship.com must have ZERO Docs entries.
  // Storybook 9 consolidated the old "essentials" bundle (controls, actions,
  // viewport, backgrounds, toolbars, measure, outline, highlight) into the
  // core, and split the docs surface into a separate docs addon. We
  // deliberately DO NOT install or register that docs addon, and no story
  // carries a docs tag, so the "Docs" pages never render. Do NOT re-add the
  // Storybook docs addon, do NOT add a `docs: {}` config block, and do NOT tag
  // any story for docs. Enforced by scripts/check-no-storybook-docs.mjs in CI
  // (see repo CLAUDE.md).
  addons: [
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
