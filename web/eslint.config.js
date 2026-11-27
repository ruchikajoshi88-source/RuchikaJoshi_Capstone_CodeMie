import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["**/*.{js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: "readonly", document: "readonly", URL: "readonly", URLSearchParams: "readonly", Blob: "readonly", fetch: "readonly", console: "readonly" }
    },
    settings: { react: { version: "18" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "no-undef": "error",
      "no-unused-vars": "warn"
    }
  },
  {
    files: ["**/*.test.{js,jsx}"],
    languageOptions: { globals: { HTMLAnchorElement: "readonly" } }
  }
];
