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
- follow-ups from the [Expo SDK 54 upgrade](https://expo.dev/changelog/sdk-54):
  - decide on Sentry: `@sentry/react-native` is installed but never initialized (see the
    commented-out init in `index.ts`), and its config plugin (now applied via `app.json`)
    warns about missing `organization`/`project` at every build — either finish the setup
    or drop the dependency
  - verify Android UI on a device/emulator: edge-to-edge is now always enabled and can no
    longer be disabled
  - try the [React Compiler](https://docs.expo.dev/guides/react-compiler/) (enabled by
    default in new SDK 54 projects, opt-in for existing ones via
    `"experiments": { "reactCompiler": true }` in `app.json`)
  - add an iOS 26 liquid glass icon: a `.icon` file made with Apple's Icon Composer,
    referenced from `ios.icon` (old icon remains as fallback for older iOS); optionally
    play with [`expo-glass-effect`](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
  - consider [remote build caching](https://docs.expo.dev/guides/cache-builds-remotely/)
    (now stable) so `npm run android`/`ios` can download a cached build instead of
    compiling locally when the native fingerprint is unchanged
- add [Apple Pay](https://docs.stripe.com/apple-pay?platform=react-native) for membership
  payments: either natively in the payment sheet (register the merchant ID
  `merchant.no.neuf.chateau` + Apple Pay certificate, set `merchantIdentifier` in the
  `@stripe/stripe-react-native` plugin config, pass `applePay` to `initPaymentSheet`,
  new iOS build), or for free by moving payment to a Stripe-hosted Checkout page in the
  browser (needs a backend Checkout Session endpoint and a return deep link)
- add [Google Pay](https://docs.stripe.com/google-pay?platform=react-native) for
  membership payments: either natively in the payment sheet (`enableGooglePay: true` in
  the plugin config, pass `googlePay` to `initPaymentSheet`, request production access in
  the Google Pay & Wallet Console, new Android build), or for free via the same
  Stripe-hosted Checkout page as for Apple Pay
