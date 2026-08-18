---
"@devfellowship/components": patch
---

Add the UX Paths `data-source` source stamp to the design system build.

The design system ships compiled, so its JSX was gone before a consuming app's
bundler ever saw it — a click on a screenshot of a DS button resolved to the
application file that mounted it, not to the button. The build now writes
`data-source="packages/ui/src/…tsx:<line>"` onto every host element it renders.

The gate is `UX_PATHS_SOURCE_STAMP`, absent by default. **The published npm
artifact is unchanged and carries zero stamps** — verified byte-identical to the
previous release build. The stamped build is distributed only as a GitHub
Release asset (`*-capture.tgz`) and is never published to any registry.
