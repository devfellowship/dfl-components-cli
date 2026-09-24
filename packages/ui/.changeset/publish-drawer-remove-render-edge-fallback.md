---
"@devfellowship/components": patch
---

PublishDrawer: "Generate thumbnail" now calls ONLY the Thumbify renderer in
dfl-services (`POST https://services.devfellowship.com/thumbify/render`). The
fallback call to the old Supabase edge function is removed. A network error or
an HTTP >= 500 answer is now a normal render error, the same as a 4xx. The
`thumbnailRenderUrl` prop and `DEFAULT_THUMBNAIL_RENDER_URL` do not change.
