---
"@devfellowship/components": minor
---

fix(ui): `sonner` is now a PEER dependency (`^1.7.0 || ^2.0.0`) instead of a regular dependency.

With `sonner@^2.0.7` as a regular dependency, an app that pins another major (for example `sonner@1.7.4`) got a second copy nested under `@devfellowship/components/node_modules/sonner`. `<SonnerToaster>` rendered with the nested copy, so `toast()` imported from the app's own `sonner` wrote to a different store and nothing showed. The app's `sonner` is now the only copy. npm 7+ installs the peer by itself; pnpm and yarn users add `sonner` to their app. New guard `scripts/check-consumer-single-copy.mjs` installs the package into a throw-away consumer with `sonner@1.7.4`, and asserts that no nested copy exists and that a toast from the app's `sonner`, and one from `/hooks`, render.
