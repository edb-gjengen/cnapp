# cnapp

The mobile app for Chateau Neuf using React and [Expo](https://expo.dev/).

[📚 Expo Documentation](https://docs.expo.dev/)

## Install

Use [mise](https://mise.jdx.dev/) to install Node, Java and the Android SDK
command-line tools.

    mise trust
    mise install
    npm install
    cp env-example .env.local

## Development

This app uses native functionality that isn't supported by [Expo Go](https://expo.dev/client),
so you need a [development build](https://docs.expo.dev/develop/development-builds/introduction/)
compiled from source. Follow Expo's
[local development setup](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)
guide for your platform, then build and run once (see below). After that, just start the dev
server and open the app on your device or simulator:

    npm run start

### Android

`mise install` provides the Android SDK (the `android` CLI
for managing the SDK, emulators and devices).

Next, install `platform-tools` (required for `adb`):

    android sdk install platform-tools

Enable [USB debugging](https://developer.android.com/studio/debug/dev-options)
or [wireless debugging](https://developer.android.com/tools/adb#connect-to-a-device-over-wi-fi) on a
connected device, or start an [emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
(`android emulator start`), then:

    npm run android

### iOS (requires macOS)

Install [Xcode](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local),
then run on the Simulator or a connected device:

    npm run ios

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
- follow-ups from the [Expo SDK 56 upgrade](https://expo.dev/changelog/sdk-56):
  - replace the deprecated `@expo/vector-icons` with the scoped
    [`@react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) packages
    (`npx @react-native-vector-icons/codemod`) — only `SimpleLineIcons` in
    `src/modules/events/EventList.tsx` uses it, yet it ships ~3.5 MB of fonts into every export
  - try [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/), production-ready as of SDK 56:
    real SwiftUI / Jetpack Compose components that could back the homegrown ones in
    `src/components/` and finally retire `react-native-simple-radio-button`
  - simplify `fetchWithTimeout` in `src/utils.ts`: `expo/fetch` is now `globalThis.fetch`, so the
    wrapper collapses to `fetch(url, { signal: AbortSignal.timeout(ms) })`. Opt back out with
    `EXPO_PUBLIC_USE_RN_FETCH=1` if it misbehaves
  - swap `@react-native-async-storage/async-storage` (used by `redux-persist` in
    `src/reduxStore.ts`) for
    [`expo-sqlite/localStorage`](https://docs.expo.dev/versions/latest/sdk/sqlite/#localstorage),
    ideally folded into the redux replacement above
  - verify on iOS: the minimum target jumped to iOS 16.4 (from 15.1), dropping the iPhone 7, 6s
    and SE (1st gen). Building now requires Xcode 26.4 on macOS 13.4+
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
