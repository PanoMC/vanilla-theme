# Pano Vanilla Theme

Pano's default theme. It is also used as a **template** when creating a new theme — the entire license/DRM infrastructure is already in place in this folder, so if you start a new theme by copying this one, it inherits everything automatically.

## Development

```bash
bun install
bun run dev          # vite dev — :3000
bun run build        # production build → build/
```

During `bun run dev` the license/DRM infrastructure is **disabled** and premium checks become no-ops. License validation only kicks in after the prebuild step, which runs as part of `bun run build`.

## Making a theme premium

Two things change, and you don't need to do anything else:

1. In `manifest.json`:
   ```diff
   - "premium": false   // or this line is absent
   + "premium": true
   ```

2. Make sure the `PANO_LICENSE_SERVER` env variable is set in the CI environment (it is already configured in release.yml as `branch == 'main' ? 'prod' : 'dev'`, so you don't need to touch it).

When `bun run build` runs:
- the prebuild script (`scripts/license/generate-license-constants.js`) fetches the **public key** from panomc.com and embeds it into `src/lib/server/license-constants.generated.js`
- after the vite build, the fingerprint plugin computes the cumulative SHA-256 of all `build/` files and writes it to `build/manifest.json` as `fileFingerprint`
- when the Pano host installs/starts this theme it recomputes the same hash and rejects it if they don't match
- at runtime the theme also validates its own files independently

## License server selection (PANO_LICENSE_SERVER)

The prebuild script makes its choice in the following order:

| Priority | Env variable | Behavior |
|---|---|---|
| 1 | `PANO_LICENSE_PUBLIC_KEY` | Takes the public key directly from the env (as a CI secret) and never connects to a server |
| 2 | `PANO_LICENSE_SERVER=prod` | Fetches the key from `https://api.panomc.com` |
| 2 | `PANO_LICENSE_SERVER=dev` | Fetches the key from `https://api-dev.panomc.com` |
| 2 | `PANO_LICENSE_SERVER=http://localhost:8087` | Fetches the key from the given URL (for testing against a local backend) |
| 3 | (none set) | Auto-detects from the git branch: `main`/`master`/`release-*` → prod, `dev`/`develop`/`feat-*`/`fix-*`/`hotfix-*` → dev |
| 4 | (still none) | The premium theme build **fails** (it does not silently fall back to a free build) |

Bonus: `PANO_LICENSE_ISSUER` — an override for JWT `iss` validation (usually not needed; it is derived automatically from the server).

## GitHub Actions

The existing `.github/workflows/release.yml` already handles everything:

```yaml
- name: Build
  env:
    PANO_LICENSE_SERVER: ${{ steps.extract_branch.outputs.branch == 'main' && 'prod' || 'dev' }}
  run: bun run build
```

- push to the `dev` branch → automatically fetches the key from the dev server
- push to the `main` branch (or a release) → fetches the key from the prod server

On free themes this env is harmless (because manifest.premium=false, the prebuild script ignores it).

### If you want to build with a hidden key in CI (offline / restricted runner)

Fetch the public key from prod once and put it in a GH repository secret:
```
Settings → Secrets → Actions → New repository secret
  Name:  PANO_LICENSE_PUBLIC_KEY
  Value: <base64 RSA-2048 key, from panomc.com>
```

Then the workflow:
```yaml
- name: Build
  env:
    PANO_LICENSE_PUBLIC_KEY: ${{ secrets.PANO_LICENSE_PUBLIC_KEY }}
  run: bun run build
```

In this case the prebuild makes no HTTP calls and reads the key from the secret.

## Building a premium theme locally

```bash
# If you are running your local Pano backend on :8087
PANO_LICENSE_SERVER=http://localhost:8087 bun run build

# Or if you want to use panomc.com's dev server
PANO_LICENSE_SERVER=dev bun run build

# Temporarily a free build (for testing)
PANO_LICENSE_REQUIRED=false bun run build
```

## Creating a new theme

```bash
cp -r vanilla-theme shadow-theme
cd shadow-theme

# 1. Edit manifest.json: id, title, version, screenshots
# 2. If it will be premium: add "premium": true
# 3. (if present) update the zip name in .github/workflows/release.yml

bun install
bun run dev
```

`scripts/license/` and `src/lib/server/license-runtime.js` already cover the entire premium infrastructure; just changing the manifest is enough.
