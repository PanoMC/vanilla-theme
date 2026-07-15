import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import path from "path";
import { collectLicenses } from "./scripts/generate-licenses.js";

const env = loadEnv("", process.cwd());

// Global flag to ensure licenses are generated only once per build
let licensesGenerated = false;

function copyFolderPlugin(folder) {
  let outDir = "";

  return {
    name: `copy-${folder}-folder`,
    apply: "build", // Run only during build
    configResolved(config) {
      outDir = "build/";
    },
    async closeBundle() {
      const srcDir = path.resolve(process.cwd(), folder);
      const destDir = path.resolve(process.cwd(), outDir, folder);

      if (!fs.existsSync(srcDir)) {
        console.warn(`Source folder "${folder}" not found at: ${srcDir}`);
        return;
      }

      try {
        await fs.promises.cp(srcDir, destDir, { recursive: true });
        console.log(`Copied "${folder}" folder from ${srcDir} to ${destDir}`);
      } catch (error) {
        console.error(`Error copying "${folder}" folder:`, error);
      }
    }
  };
}

function copyManifestPlugin(filename = "manifest.json") {
  let outDir = "";

  return {
    name: "copy-manifest-json",
    apply: "build",
    configResolved(config) {
      outDir = "build/";
    },
    async closeBundle() {
      const srcPath = path.resolve(process.cwd(), filename);
      const destPath = path.resolve(process.cwd(), outDir, filename);

      if (!fs.existsSync(srcPath)) {
        console.warn(`Manifest file not found at: ${srcPath}`);
        return;
      }

      try {
        await fs.promises.copyFile(srcPath, destPath);
        console.log(`Copied manifest from ${srcPath} to ${destPath}`);
      } catch (err) {
        console.error("Failed to copy manifest.json:", err);
      }
    }
  };
}

function generateLicensesPlugin() {
  let outDir = "";

  return {
    name: "generate-licenses",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(process.cwd(), "build");
    },
    async closeBundle() {
      // Don't regenerate if file already exists (SSR and client build run in separate processes)
      const licensesPath = path.join(outDir, "licenses.json");
      if (fs.existsSync(licensesPath)) {
        return;
      }

      // Run only once (closeBundle is called for both SSR and client builds)
      if (!licensesGenerated) {
        licensesGenerated = true;
        try {
          console.log("Generating licenses...");
          // Ensure the build directory exists
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
          collectLicenses(outDir);
          console.log("Licenses generated successfully.");
        } catch (err) {
          console.error("Failed to generate licenses:", err);
          // Don't fail the build, just warn
        }
      }
    }
  };
}

export default defineConfig(({ command }) => {
  return {
    clearScreen: false,
    plugins: [
      sveltekit(),
      generateLicensesPlugin(),
      copyFolderPlugin("lang"),
      copyFolderPlugin("screenshots"),
      copyManifestPlugin(),
    ],
    // NOTE: The theme file-fingerprint is stamped into build/manifest.json by
    // scripts/license/finalize-fingerprint.js, which package.json's `build` script runs
    // AFTER `vite build`. Doing it inside a vite plugin would race with SvelteKit's
    // adapter-node two-pass bundling (SSR + client), producing a digest that doesn't
    // cover all files.
    ssr: {
      noExternal: command === "build" ? true : ["@panomc/sdk", "svelte-i18n"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          loadPaths: [
            process.cwd(),
            path.resolve(process.cwd(), "node_modules"),
          ],
          quietDeps: true,
          silenceDeprecations: [
            "mixed-decls",
            "color-functions",
            "global-builtin",
            "import",
          ],
        },
      },
    },
    optimizeDeps: {
      include: ["deepmerge", "svelte-i18n"],
      exclude: ["@panomc/sdk", "svelte"],
    },
    server: {
      proxy: {
        "/api": env.VITE_API_URL.replace("/api", ""),
      },
      allowedHosts: true,
      hmr: {
        path: "/",
      },
    },
    resolve: {
      alias: {
        "@theme-style":
          command === "serve" && process.env.VITE_DEV_UI !== "true"
            ? path.resolve(process.cwd(), "src/styles/_empty.scss")
            : path.resolve(process.cwd(), "src/styles/style.scss"),
      },
      preserveSymlinks: true,
      dedupe: ["svelte", "@panomc/sdk", "svelte-i18n"],
    },
    build: {
      manifest: true,
      // svelte/@panomc/sdk are deliberately NOT externalized: the host bundles its
      // own runtime (immutable-cached under /_app/immutable), and plugins reach the
      // very same module instances through the /runtime shims + the registry in
      // hooks.client.js. See scripts/generate-runtime-shims.js.
    },
  };
});
