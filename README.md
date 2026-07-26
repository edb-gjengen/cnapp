# cnapp

The mobile app for Chateau Neuf using React and [Expo](https://expo.dev/).

[📚 Expo Documentation](https://docs.expo.dev/)

## Install

Use [mise](https://mise.jdx.dev/) to install Node.

    mise trust
    mise install
    npm install
    cp env-example .env.local

## Development

Install [Expo Go](https://expo.dev/client) to run the app on your phone.

    npm run start

## Scripts

- `npm run start` - Start Expo development server on port 19001
- `npm run android` - Run app in Android emulator
- `npm run ios` - Run app in iOS simulator (requires macOS)
- `npm run web` - Run app in web browser
- `npm run lint` - Check code with ESLint
- `npm run format` - Fix code formatting with ESLint
- `npm run check-types` - Run TypeScript type checking
- `npm test` - Run the test suite
- `npm run test:watch` - Run the test suite in watch mode

## History

This is a fork of [dusken-client](https://git.neuf.no/edb/dusken-client) with some
history, code and binary blobs related to React Native functionality filtered out before
[commit 7f6b2c21](https://git.neuf.no/edb/cnapp/commit/7f6b2c2129068d2fe8623172582bffd31eb4a131).

## TODO

- add functionality needed to pass new store requirements
  - privacy policy
  - delete my account
  - ???
- test in android emulator? (`npm run android`)
- test in ios emulator? (`npm run ios`, requires macOS)
- use [Expo Application Services](https://expo.dev/eas) to build and submit app to stores
- replace redux (`redux` v5 + `redux-thunk`, hand-written actions and the deprecated
  `createStore`): nearly everything in the store is server state (user data) plus one auth
  token, so drop redux for [TanStack Query](https://tanstack.com/query/latest) for
  fetching/caching, with the token in React context + AsyncStorage — replaces
  `src/reducers.ts`, the fetch thunks in `src/api.ts` and the `isFetching*`/error flags
- replace [moment](https://momentjs.com/docs/#/-project-status/) (maintenance mode) with
  `date-fns`
- replace unmaintained UI packages:
  - `react-native-confetti` (last release 2017, mocked out in tests)
  - `react-native-simple-radio-button` (react-native-ui-lib already ships RadioButton/RadioGroup)
- migrate ESLint 8 + airbnb config (both EOL) to ESLint 9 flat config or
  [eslint-config-expo](https://docs.expo.dev/guides/using-eslint/)
