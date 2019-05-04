## Install
    # See https://facebook.github.io/react-native/docs/getting-started.html#content
    yarn
    cd ios; pod install  # ios only

    # Environment settings
    cp env-example .env

    react-native start
    react-native run-android

## Development
    # Improve compile times
    touch ~/.gradle/gradle.properties && echo -e "org.gradle.daemon=true\norg.gradle.jvmargs=-Xmx2048M" >> ~/.gradle/gradle.properties
    # Run android emulator (first avd)
    yarn emulator
    # Make sure you have hw.keyboard=yes in your avd config.ini (in $HOME/.android/avd/.../) for reloading when pressing R twice to work.

### Linking native dependencies
We use a Podfile to install the stripe ios library, but not for anything else.
Before running any `react-native link` commands, rename `ios/Podfile` to something else before running, then rename the file back when you are done.
This is to let the react-native CLI know we use the Dusken xcode project and not cocoapods for managing all other dependencies.
This avoids alot of issues resulting from poor cocoapods support by react native.

## Prepare release build
    # Fastlane
    bundle update

    # Sentry
    # Get auth token from https://sentry.neuf.no/api/ with project:write scope
    cp ios/sentry.properties-example ios/sentry.properties
    cp android/sentry.properties-example android/sentry.properties

## Create release build (Android)
    # Aquire the keystore and put it in android/app/dusken-client.keystore

    # Put these properties in ~/.gradle/gradle.properties along with the correct passwords
    DUSKEN_RELEASE_STORE_FILE=dusken-client.keystore
    DUSKEN_RELEASE_KEY_ALIAS=dusken-client
    DUSKEN_RELEASE_STORE_PASSWORD=
    DUSKEN_RELEASE_KEY_PASSWORD=

    # Build
    yarn build-android # Output is in android/app/build/outputs/apk

    # Note: Make sure you have the file android/google_play.json
    # Ref: https://docs.fastlane.tools/actions/supply/#setup

    # Publish android build to the Google Play beta track
    yarn release-android

## Libraries

We use https://nativebase.io/ for generic UI components
