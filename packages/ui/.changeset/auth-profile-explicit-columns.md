---
"@devfellowship/components": patch
---

Fix `AuthProvider`: read `profiles` with explicit columns (`PROFILE_COLUMNS`) instead of `select("*")`. On DFL prod the `authenticated` role has no SELECT on `profiles.email`, so the `*` read failed with 42501 and `profile` (with `avatar_url`) was always null: no app shell showed the user photo. `profile.email` now comes from the session user. New optional prop `profileColumns`.
