// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript', 'plugin:import/typescript'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
    project: ['./tsconfig.json', './tsconfig.node.json']
  },
  env: {
    browser: true,
    node: true
  },
  // add your custom rules here
  rules: {
    // TODO: change no-console to error out for prod
    'no-console': ['warn'],
    // TODO: fix copied js code that makes this warn necessary
    'no-use-before-define': ['warn'],
    'linebreak-style': 0,
    //TODO: make requests asynchronous
    'no-await-in-loop': ['warn'],
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never',
        vue: 'never'
      }
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [2, { props: false }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    'no-mixed-operators': ['off'],
    'arrow-parens': ['warn', 'as-needed'],
    'comma-dangle': ['warn', 'never'],
    'no-underscore-dangle': ['off'],
    'no-continue': ['off'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    quotes: [
      'warn',
      'single',
      {
        allowTemplateLiterals: true
      }
    ],
    'max-len': ['warn', { code: 200 }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            js: 'never',
            ts: 'never',
            vue: 'always'
          }
        ]
      }
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
            vue: 'never'
          }
        ]
      }
    }
  ]
};
