/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['react-native-gesture-handler/jestSetup', '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Metro resolves SVGs to components via react-native-svg-transformer; Jest gets a stub instead
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    // `@` and `@assets` are aliases for `src` and `assets` (see tsconfig paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
  transformIgnorePatterns: [
    // jest-expo's default list, extended with untranspiled libraries this app uses
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-ui-lib|uilib-native))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/types/**', '!src/testUtils.tsx'],
  // A suite's first test must do Babel transforms if not cached (~9s with --coverage)
  testTimeout: 20000,
};
