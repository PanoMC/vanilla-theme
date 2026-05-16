/**
 * Vite plugin: after `vite build` writes the SvelteKit adapter-node bundle into `build/`,
 * compute the stable cumulative SHA-256 of every file in `build/` (except manifest.json)
 * and inject the digest into `build/manifest.json` as the `fileFingerprint` field.
 *
 * The Pano host re-runs the same hash function when installing the theme and again every
 * time it starts the theme's bun process, refusing to spawn a premium theme whose
 * extracted folder no longer matches the fingerprint that shipped with it. The theme's
 * own license-runtime helper re-runs it once more from inside the process as a defence-
 * in-depth pass (so a tampered host that skipped the host-side check still has to face
 * the theme's own integrity assertion).
 *
 * Why patch the JSON in `closeBundle` instead of a postbuild npm script: Vite calls
 * `closeBundle` separately for the SSR and client passes; we use an idempotency guard so
 * the digest is computed once, after the second pass when `build/` is final.
 */
import fs from "node:fs";
import path from "node:path";
import { computeStableFileFingerprint } from "./file-fingerprint.js";

export function themeFingerprintPlugin({ buildDir = "build", manifestName = "manifest.json" } = {}) {
  let processedThisRun = false;

  return {
    name: "pano-theme-fingerprint",
    apply: "build",
    async closeBundle() {
      if (processedThisRun) return;

      const absBuild = path.resolve(process.cwd(), buildDir);
      const absManifest = path.join(absBuild, manifestName);

      if (!fs.existsSync(absBuild) || !fs.statSync(absBuild).isDirectory()) {
        console.warn(`[pano-theme-fingerprint] build dir "${absBuild}" missing, skipping`);
        return;
      }
      if (!fs.existsSync(absManifest)) {
        // copyManifestPlugin runs in closeBundle too; if it hasn't fired yet on the first
        // bundle pass we silently skip — the second pass picks it up.
        return;
      }

      // Both passes call closeBundle. Only seal after we can see a settled build/ — i.e.
      // manifest.json is there. We also gate so we don't re-walk the tree twice.
      processedThisRun = true;

      const fingerprint = computeStableFileFingerprint(absBuild, [manifestName]);
      const manifest = JSON.parse(fs.readFileSync(absManifest, "utf-8"));
      manifest.fileFingerprint = fingerprint;
      fs.writeFileSync(absManifest, JSON.stringify(manifest, null, 2) + "\n");
      console.log(
        `[pano-theme-fingerprint] manifest.fileFingerprint = ${fingerprint.slice(0, 16)}…`
      );
    },
  };
}
