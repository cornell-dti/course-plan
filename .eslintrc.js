// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    '@vue/airbnb',
    '@vue/typescript',
    'plugin:import/typescript',
    'prettier',
    'prettier/vue',
    'plugin:cypress/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  env: {
    browser: true,
    node: true,
  },
  // add your custom rules here
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error'],
    'vue/attribute-hyphenation': ['off'],
    // TODO: auto-fix of this and the next rule introduces too many code changes that might cause merge conflict.
    'vue/attributes-order': ['off'],
    'vue/order-in-components': ['off'],
    'vue/no-v-html': ['error'],
    'no-console': ['warn'],
    'no-await-in-loop': ['error'],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', { props: false }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js'],
      },
    ],
    'no-mixed-operators': ['off'],
    'no-continue': ['error'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'max-classes-per-file': ['off'],
    // TypeScript will handle it. It also doesn't work with typescript global types.
    'no-undef': ['off'],
    'no-unused-vars': ['off'],
    'no-use-before-define': ['off'],
    'vue/no-mutating-props': ['warn'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            js: 'never',
            ts: 'never',
            vue: 'always',
          },
        ],
      },
    },
    {
      files: ['*.js'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            js: 'never',
            ts: 'never',
            vue: 'never',
          },
        ],
      },
    },
  ],
};
