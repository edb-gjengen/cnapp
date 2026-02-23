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

## History

This is a fork of [dusken-client](https://git.neuf.no/edb/dusken-client) with some
history, code and binary blobs related to React Native functionality filtered out before
[commit 7f6b2c21](https://git.neuf.no/edb/cnapp/commit/7f6b2c2129068d2fe8623172582bffd31eb4a131).

## TODO

- add functionality needed to pass new store requirements
  - privacy policy
  - delete my account
  - ???
- add some basic unit tests
- test in android emulator? (`npm run android`)
- test in ios emulator? (`npm run ios`, requires macOS)
- use [Expo Application Services](https://expo.dev/eas) to build and submit app to stores
