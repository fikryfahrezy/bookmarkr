import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  environments: {
    popup: {
      plugins: [pluginVue()],
      source: {
        entry: { popup: "./src/popup/index.ts" },
      },
    },
    background: {
      source: {
        entry: { background: "./src/background/index.ts" },
      },
      output: {
        target: "web-worker",
        filename: { js: "[name].js" },
        distPath: { js: "" },
      },
    },
  },
});
