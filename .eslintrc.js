module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  "rules": {
    "@typescript-eslint/camelcase": ["error", { "properties": "never" } ],
    "@typescript-eslint/no-use-before-define": [ "warn", { "functions": true, "classes": true }]
  }
};
