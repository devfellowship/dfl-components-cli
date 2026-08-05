import { defineConfig } from "vitest/config";

// NOTE: do NOT alias react/react-dom to `../../node_modules`.
//
// This config used to resolve react, react-dom and the two jsx runtimes to
// `path.resolve(__dirname, "../../node_modules")` — the REPO ROOT. There is no
// root package.json in this repo (everything lives in packages/ui), so that
// directory never exists and every alias pointed at a path that was never
// installed.
//
// The effect was silent: the 9 test suites that import React failed to LOAD
// ("Failed to resolve import 'react/jsx-dev-runtime'"), which vitest reports as
// failed *suites* containing zero tests. The default reporter line still read
// `PASS (64) FAIL (0)` because the 64 non-React tests did pass — so the run
// looked green to a human while a quarter of the suites had never executed.
//
// react/react-dom are ordinary devDependencies of this package; plain node
// resolution finds them in packages/ui/node_modules. No alias is needed, and
// only one copy is installed, so there is no duplicate-React hazard to dedupe.
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
