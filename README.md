# cnapp

The mobile app for Chateau Neuf using React and [Expo](https://expo.dev/).

[📚 Expo Documentation](https://docs.expo.dev/)

## Install

Use [mise](https://mise.jdx.dev/) to install Node, Java and the Android SDK
command-line tools.

    mise trust
    mise install
    npm install
    prek install
    cp env-example .env.local

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

## Development

This app uses native functionality that isn't supported by [Expo Go](https://expo.dev/client),
so you need a [development build](https://docs.expo.dev/develop/development-builds/introduction/)
compiled from source. Follow Expo's
[local development setup](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)
guide for your platform, then build and run once (see below). After that, just start the dev
server and open the app on your device or simulator:

    npm run start

### Demo users

Dev builds accept three fake users (defined in `src/api.ts`) so you can preview the
membership screens without a real account. They are valid with any password:

| Username    | State                                                   |
| ----------- | ------------------------------------------------------- |
| `nonmember` | Not a member, no membership history                     |
| `member`    | Valid standard membership, expires 2099-08-01           |
| `volunteer` | Same membership as `member`, but flagged as a volunteer |

They only work via `npm run start`/`android`/`ios`, not in EAS `preview` or
`production` builds. Only login and fetching user data are faked, so
buying a membership or deleting the account will fail against the real API.

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

### Upgrading dependencies

Many packages (`expo-*`, `react-native`, and more) are versioned in lockstep with the
Expo SDK. Check them with `npx expo install --check` and upgrade with
`npx expo install --fix` instead of `npm update`.

## Pre-commit hooks

Git hooks are managed with [prek](https://prek.j178.dev/) (installed by `mise install`)
and configured in `prek.toml`. Enable them with:

    prek install

Commits then only succeed if linting, type checking and the related tests pass. Run all
hooks against the whole repo with:

    prek run --all-files

## History

This is a fork of [dusken-client](https://git.neuf.no/edb/dusken-client) with some
history, code and binary blobs related to React Native functionality filtered out before
[commit 7f6b2c21](https://git.neuf.no/edb/cnapp/commit/7f6b2c2129068d2fe8623172582bffd31eb4a131).

## TODO

- upload source maps to Bugsink so release-build stack traces are symbolicated (until then
  they're minified): create an auth token in Bugsink and set `SENTRY_AUTH_TOKEN` as an
  [EAS secret](https://docs.expo.dev/eas/environment-variables/) — the Sentry plugin config
  in `app.json` (url/organization/project) is already set up for the upload. Needs
  [Bugsink ≥ 2.0.14](https://www.bugsink.com/docs/sourcemaps/); verify the project slug in
  Bugsink matches `cnapp`
- test in ios emulator? (`npm run ios`, requires macOS)
- use [Expo Application Services](https://expo.dev/eas) to build and submit app to stores
- explore Expo features:
  - add an iOS 26 liquid glass icon: a `.icon` file made with Apple's Icon Composer,
    referenced from `ios.icon` (old icon remains as fallback for older iOS); optionally
    play with [`expo-glass-effect`](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
  - consider [remote build caching](https://docs.expo.dev/guides/cache-builds-remotely/)
    (now stable) so `npm run android`/`ios` can download a cached build instead of
    compiling locally when the native fingerprint is unchanged
  - try [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/), production-ready as of SDK 56:
    real SwiftUI / Jetpack Compose components that could back the homegrown ones in
    `src/components/`
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
