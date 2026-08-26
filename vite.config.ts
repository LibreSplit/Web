import fs from "fs";
import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { type Plugin, defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import solid from "vite-plugin-solid";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    copyIndexTo404(),
    sitemap({
      hostname: "https://libresplit.org",
      dynamicRoutes: [
        "/installation",
        "/converter",
        "/docs",
        "/docs/auto-splitters.md",
        "/docs/auto-splitter-tips.md",
        "/docs/settings-keybinds.md",
        "/docs/split-files.md",
        "/docs/themes.md",
        "/docs/troubleshooting.md",
      ],
      exclude: ["/404"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});

// Home spun plugin for copying index.html to 404.html at build time.
// This makes SPA routing work on GitHub pages.
function copyIndexTo404(): Plugin {
  return {
    name: "copy-index-to-404",
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      const notFoundPath = path.join(distDir, "404.html");

      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log("Copied index.html to 404.html for SPA fallback");
      } else {
        console.warn("index.html not found in dist directory");
      }
    },
  };
}
