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
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'react/prefer-stateless-function': 1,
    'react/prop-types': 'off', // FIXME: typescript
    'class-methods-use-this': 'error', // FIXME: refactor
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/sort-comp': 'off',
    'max-len': 'off',
    'no-use-before-define': ['error', { functions: true, classes: true, variables: false }], // disable the rule for variables, but enable it for functions and classes
    'react-native/no-inline-styles': 'off', // FIXME: refactor
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
