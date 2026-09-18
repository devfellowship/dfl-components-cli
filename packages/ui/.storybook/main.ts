import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

// Umami (analytics.devfellowship.com) page-view tag for
// storybook.devfellowship.com — config-driven, read at BUILD time from
// VITE_UMAMI_WEBSITE_ID (the deploy workflow passes the GitHub repo variable
// of the same name). Unset or empty → the manager head gets NO tag.
// Only the MANAGER (the top-level page) carries it: the preview iframe would
// count every story switch a second time. Plan
// 20260918-umami-traffic-report-and-tracking-coverage (P4).
function umamiTag(websiteId: string | undefined): string {
  const id = (websiteId ?? "").trim();
  if (!id) return "";
  return `
    <script defer src="https://analytics.devfellowship.com/script.js" data-website-id="${id}"></script>`;
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // `../public` is copied verbatim into the build output. It ships the
  // Cloudflare Pages `_redirects` guard that forces missing asset/chunk/font
  // requests to a REAL 404 instead of the SPA-fallback HTML that once
  // amplified a single 404 into an infinite fetch loop (see public/_redirects
  // and src/styles/fonts.css for the full incident write-up).
  // `src/brand` is served at the root too, so the Component Hub's own tab
  // carries the DFL mark this package ships to every app — from the same files,
  // not a copy that drifts.
  staticDirs: ["../public", { from: "../src/brand", to: "/" }],
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
  // Storybook Composition — the fleet apps keep their stories next to their own
  // code, and this Storybook is the single URL / single navigation tree the
  // designer opens. Each `refs` entry is fetched BY THE VIEWER'S BROWSER, so a
  // ref target must be anonymously reachable and must send CORS headers; the
  // itera-storybook Cloudflare Pages project sends `access-control-allow-origin: *`
  // on `index.json`, so it qualifies. A ref that becomes private stops resolving
  // for everyone, and the section renders as an error in the sidebar.
  refs: {
    "itera-player": {
      title: "ITERA Player",
      url: "https://storybook.iterahq.dev",
      // Collapsed by default — the composed tree is a neighbour, not the
      // primary content of this Storybook.
      expanded: false,
    },
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Storybook would find `favicon.svg` on its own, but spelling the block out
  // keeps it identical to what `dfl-components favicon` writes into every app.
  managerHead: (head) => `${head}
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />${umamiTag(
      process.env.VITE_UMAMI_WEBSITE_ID,
    )}`,
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
