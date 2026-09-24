---
"@devfellowship/components": minor
---

PublishDrawer: "Generate thumbnail" now calls the Thumbify renderer in
dfl-services (`POST https://services.devfellowship.com/thumbify/render`, same
contract as the `render-design-template` edge function) first. On a network
error or HTTP >= 500 it makes one fallback call to the edge function via the
injected Supabase client; a 4xx answer does not fall back. New optional prop
`thumbnailRenderUrl` overrides the endpoint, and `DEFAULT_THUMBNAIL_RENDER_URL`
is exported. Existing consumers need no change.
