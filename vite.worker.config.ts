import { defineConfig } from "vite";
export default defineConfig({
  build: {
    ssr: "apps/api/src/worker.mjs",
    outDir: "dist/server",
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "index.js" } },
  },
});
