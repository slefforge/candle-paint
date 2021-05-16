module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'max-len': 0,
    'no-unused-vars': 0,
    'prefer-template': 0,
    'prefer-destructuring': 0,
  },
};
