# CLAUDE.md

This file gives Claude Code context for working in this repository.

## What this is

`vanilla-theme` is the **canonical, reference SvelteKit theme** for Pano — the user-facing
front-end (login, register, profile, settings, news, support, …; ~31 routes). It is the **upstream
source of truth** for the theme fork family: `blaze-theme`, `blocky-theme`, `frost-theme`, and
`banana-theme` are forks that diverge on visual design but **must keep the plugin-facing API surface
in sync with this repo** (see "Fork family" below).

Stack: **Svelte 5 + SvelteKit 2 + Vite + `@sveltejs/adapter-node` + Bootstrap 5 + svelte-i18n**, JS
with JSDoc, **Bun** package manager. It pulls data from the backend through a vendored `@panomc/sdk`
(`src/pano-sdk`) and is **launched and reverse-proxied by the `pano-web-platform` backend** (see
`../../CLAUDE.md`), not served standalone.

## Commands

```bash
bun install                 # postinstall bundles the local @panomc/sdk (scripts/bundle-internal-libs.js)
bun run dev                 # Vite dev on 0.0.0.0:3000
bun run dev:ui              # dev + concurrent `sass --watch` (use when editing SCSS)
bun run build               # prebuild (license constants) → vite build → fingerprint manifest
bun run build:ui            # one-shot SCSS → static/style.css
bun run lint                # prettier -c
bun run format              # prettier --write
```

API base is `/api`, proxied in dev via `VITE_API_URL` in `.env`. Run against a local backend with
`init-ui = true` in the platform's `config.conf`.

## Premium / license system

`scripts/license/` implements premium-resource protection (mirrored backend-side in
`com.panomc.platform.license`):

- `prebuild` (`generate-license-constants.js`) fetches an RS256 **public key** and writes
  `src/lib/server/license-constants.generated.js`.
- `build` runs `finalize-fingerprint.js` after Vite to **SHA-256-fingerprint** the `build/` output
  into `manifest.json`; `src/lib/server/license-runtime.js` validates it at startup.
- A theme with `"premium": false` (or absent) in `manifest.json` skips all of this and builds
  offline. The license server is selected by `PANO_LICENSE_SERVER` / `PANO_LICENSE_PUBLIC_KEY` env
  (CI sets prod on `main`, dev otherwise); see `README.md`.

## Fork family — this repo is upstream

`blaze`/`blocky`/`frost`/`banana`-theme are forks. When a Pano plugin needs new theme API, **it
lands here first**, then must be propagated to every fork or the plugin silently degrades on sites
running that theme. Each fork's own `CLAUDE.md` has the propagation steps; the canonical procedure:

1. Find the commit/diff here that touched the shared surface.
2. Diff just the shared files: `git diff <before>..HEAD -- src/lib/PluginAPI.js src/lib/components/LoginFormBody.svelte … > /tmp/sync.patch`
3. In the fork: `git apply --3way /tmp/sync.patch`, resolve conflicts adopting **this repo's API** but keeping the fork's visual style.
4. Build the fork and smoke-test the affected plugin.

### Shared API surface (keep identical across forks)

- `src/lib/PluginAPI.js` — the `pano.ui.*` namespaces/helpers plugins call.
- **Lifecycle event names**: `theme:login:load`, `theme:register:load`, `theme:view:<id>:load`, …
- **View-slot ids**: `login-content`, `register-content`, `login-alt-methods`, `profile-content`,
  `settings-content`, … (where plugins mount components).
- Reusable form components plugins mount via `panoApi.ui.auth.*.form.get()` —
  `LoginFormBody.svelte`, `RegisterForm.svelte`.

### Fork-specific (diverge freely)

Everything under `src/styles/`, Bootstrap class choices, page chrome/copy in `src/lib/pages/*`,
fork-only components/animations/layouts, and `static/` assets.

## Plugin interplay (why the surface matters)

- **`pano-plugin-auth-guard`** (captcha + 2FA) injects components into `login-content` /
  `register-content` and intercepts global `fetch`.
- **`pano-plugin-social-login`** hosts its own pages (`/social-login/link|register|complete`) that
  call `pano.ui.auth.login.load()` / `register.load()` to populate the theme's slots so installed
  widgets render there identically to the theme's own `/login`.

## Conventions

- Use Svelte 5 runes for new code. On plugin-hosted pages avoid top-level `onDestroy` — prefer
  `$effect(() => () => cleanup())` for SSR safety.
- Components in `src/lib/components/`, pages in `src/lib/pages/`, plugin glue in `src/lib/services/`
  and `src/lib/ui-logics/`. i18n via `svelte-i18n`'s `_` store.
- Releases via **semantic-release** on `alpha`/`beta`/`main` → **conventional commits**.

See `PANO-THEME-DESIGN-CONTEXT.md` at the workspace root for the full "what is fixed vs. free when
designing a Pano theme" contract.
