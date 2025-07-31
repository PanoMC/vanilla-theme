import { sveltekit } from "@sveltejs/kit/vite";
import { loadEnv } from "vite";
import fs from "fs";
import path from "path";

const env = loadEnv("", process.cwd());

function copyFolderPlugin(folder) {
  let outDir = "";

  return {
    name: `copy-${folder}-folder`,
    apply: "build", // Run only during build
    configResolved(config) {
      // Get the output directory from Vite config
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

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    copyFolderPlugin("lang"),
    copyFolderPlugin("screenshots")
  ],
  server: {
    proxy: {
      "/api": env.VITE_API_URL.replace("/api", "")
    },
    allowedHosts: true
  }
};

export default config;
