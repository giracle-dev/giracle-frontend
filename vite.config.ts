import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      srcDir: "./src",
      manifest: {
        short_name: "Giracle",
        name: "Giracle",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#7480ff",
        background_color: "#1d232a",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  define: {
    __VERSION__: `"${pkg.version}"`,
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.PUBLIC_BACKEND_ADDRESS || "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        target: process.env.PUBLIC_BACKEND_ADDRESS || "http://localhost:3000",
        ws: true,
      },
    },
  },
});
