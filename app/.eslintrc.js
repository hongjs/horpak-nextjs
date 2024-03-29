module.exports = {
  env: {
    es2022: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    ecmaVersion: 13,
    sourceType: 'module',
  },

  extends: ['standard-with-typescript'],
  rules: {
    semi: 'off',
    'no-var': 'off',
    'prefer-const': 'off',
    'no-unneeded-ternary': 'off',
    eqeqeq: 'off',
    curly: 'off',
    'comma-dangle': 'off',
    'no-empty-pattern': 'off',
    'array-callback-return': 'off',
    'import/first': 'off',
    'import/no-duplicates': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
  },
};
