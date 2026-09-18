---
"@devfellowship/components": minor
---

AppNavbar: add an optional `endSlot` prop, rendered in the right-hand
cluster immediately before the theme toggle button. `actions` renders next
to the breadcrumb on the left and has no way to reach the true right edge
of the navbar (the left group does not stretch to fill it), so apps that
need a GitHub link or a "Sign in" CTA flush against the theme toggle had no
supported way to place it there. `endSlot` is purely additive and optional;
existing consumers are unaffected.
