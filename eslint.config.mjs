import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable TypeScript related ESLint rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",

      // Disable React related ESLint rules
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",

      // Disable general ESLint rules
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "prefer-const": "off",
      "no-var": "off",

      // Disable import related rules
      "import/no-unused-modules": "off",
      "import/order": "off",

      // Disable accessibility rules
      "@next/next/no-img-element": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;