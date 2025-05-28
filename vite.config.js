// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  plugins: [
    vue(),
    // Adjusted plugin invocation
    monacoEditorPlugin({
      languageWorkers: [
        "json",
        "css",
        "html",
        "typescript",
        "editorWorkerService", // 'editorWorkerService' is often the default and might not need explicit listing
      ],
      // You might also want to specify globalAPI: true if you need Monaco available globally
      // globalAPI: true,
    }),
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      // These are often automatically handled by the plugin but explicit inclusion can sometimes help
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
    ],
  },
});