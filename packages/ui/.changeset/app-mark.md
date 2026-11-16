---
"@devfellowship/components": minor
---

New `AppMark` molecule: the icon and the name of a DFL fleet app, from a row of `apps.apps` (`{ slug, name, icon_slug }`). Sizes 16, 20 and 32. The name shows in a tooltip on hover, keyboard focus and tap. When `icon_slug` is null, the slug is unknown, or the icon fails to load, an inline neutral fleet mark shows instead. `AppMarkStack` shows up to 3 overlapped icons and a `+N` count.

`AppsRegistryProvider` and `useAppsRegistry` read `apps.apps` once per Supabase client (explicit columns `slug,name,icon_slug,kind`, the caller's session, never a service-role client) and cache the rows, so `<AppMark slug="os" />` works anywhere below the provider. A member reads every row; a non-member and anon read the published rows. Without a provider, pass the row as `app`.

Adoption: `<AppsRegistryProvider supabase={supabase}>…</AppsRegistryProvider>` once, then `<AppMark slug="os" />`.
