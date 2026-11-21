---
"@devfellowship/components": patch
---

perf(build): the ESM build emits one chunk per source module, so a consumer bundle keeps only the components it imports.

`dist/index.js` was one 400 KB file with every component in it. Each component is a top-level `React.forwardRef(...)` call plus a `displayName` assignment, and a bundler cannot prove those statements free of side effects. So an app that imported only `Button` shipped every component and their dependencies (vaul, react-day-picker, date-fns, cmdk, embla-carousel, react-resizable-panels). On itera-player `/login` that was 99 KB gzip of dead code.

`tsup.config.ts` now also passes every library module (`src/{components,hooks,lib,providers,utils}`) as an entry under `dist/_m/`. With `splitting: true`, esbuild emits each module as its own chunk, and `dist/index.js` becomes re-exports from those chunks. `dist/_m/` is deleted after the build. The public entries, their names, their types and the CJS build do not change. Module-level state still exists once (one chunk per module).

New CI guard `scripts/check-esm-treeshake.mjs`: it bundles `{ Button, cn }` from `dist/index.js` and fails when another component's dependency is in the bundle or the bundle is above 20 KB gzip.
