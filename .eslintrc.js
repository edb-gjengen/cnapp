module.exports = {
  root: true,
  extends: [
    '@react-native',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'class-methods-use-this': 'error', // FIXME: refactor
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': ['error', { functions: true, classes: true, variables: false }], // disable the rule for variables, but enable it for functions and classes

    'react/prefer-stateless-function': 1,
    'react/prop-types': 'off', // FIXME: typescript
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/sort-comp': 'off',
    'react-native/no-inline-styles': 'off', // FIXME: refactor
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**'],
      },
    ],
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'unused-imports/no-unused-imports': 'error',
  },
  plugins: ['prettier', 'unused-imports'],
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
};
