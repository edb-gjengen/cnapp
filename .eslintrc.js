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
    'no-plusplus': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'react/prefer-stateless-function': 1,
    'react/prop-types': 'off', // FIXME: typescript
    'class-methods-use-this': 1, // FIXME: refactor
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/sort-comp': 0,
    'max-len': 0,
    'no-use-before-define': ['error', { functions: true, classes: true, variables: false }], // disable the rule for variables, but enable it for functions and classes
  },
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
};
