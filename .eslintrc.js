module.exports = {
  root: true,
  ignorePatterns: ['coverage/'],
  extends: [
    '@react-native',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'class-methods-use-this': 'error', // FIXME: refactor
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: true, classes: true, variables: false }], // disable the rule for variables, but enable it for functions and classes

    'react/prefer-stateless-function': 1,
    'react/prop-types': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/sort-comp': 'off',
    'react-native/no-inline-styles': 'off', // FIXME: refactor
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          '**/__tests__/**',
          'src/testUtils.tsx',
          'jest.config.js',
          'jest.setup.js',
          '__mocks__/**',
        ],
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
  },
  plugins: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.js'],
    },
    {
      // Jest infrastructure is CommonJS by nature
      files: ['jest.config.js', 'jest.setup.js', '__mocks__/**'],
      rules: {
        'global-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/extensions': 'off',
        'class-methods-use-this': 'off',
      },
    },
  ],
};
