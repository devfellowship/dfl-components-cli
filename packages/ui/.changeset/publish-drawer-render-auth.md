---
"@devfellowship/components": patch
---

PublishDrawer: "Generate thumbnail" now sends the caller's user JWT
(`Authorization: Bearer <access_token>`, read from the injected client's
`supabase.auth.getSession()`) to the Thumbify renderer. The renderer requires
it for a template render (plan `20260924-thumbify-renderer-to-dfl-services`,
Q "auth" = A) and writes the user's id on the render row.
`PublishDrawerSupabase.auth` is optional.
