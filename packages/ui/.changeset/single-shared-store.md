---
"@devfellowship/components": patch
---

fix(ui): every entry point now shares ONE copy of each module that holds state.

`tsup` ran with `splitting: false`, so a module that two entries import was inlined into each of them. `use-toast` kept its listeners and its in-memory state at module level, so `toast()` imported from `@devfellowship/components/hooks` wrote to a store that the `<Toaster>` of `@devfellowship/components` never read: nothing showed. The same split hit `AuthContext` (`useAuth` from `/hooks` or `/providers` did not see the `AuthProvider` of the root entry), the feature-flag context, and `cn`. The build now uses `splitting: true`, which emits shared chunks. A new test (`src/__tests__/entry-shared-state.test.tsx`) imports the built entries and asserts both the toast render and that every export name shared by two entries is the same value.
