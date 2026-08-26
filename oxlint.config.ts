import solid from "eslint-plugin-solid";
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ["dist/**"],
  jsPlugins: ["eslint-plugin-solid"],
  options: {
    reportUnusedDisableDirectives: "error",
  },
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import"],
  rules: {
    ...solid.configs.typescript.rules,
    "import/no-unassigned-import": [
      "error",
      {
        allow: ["**/*.css"],
      },
    ],
    "typescript/consistent-type-definitions": ["error", "interface"],
  },
});
