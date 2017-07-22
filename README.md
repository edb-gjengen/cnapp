## Install
    # See https://facebook.github.io/react-native/docs/getting-started.html#content
    yarn
    react-native start
    react-native run-android

## Development
    # Improve compile times
    touch ~/.gradle/gradle.properties && echo -e "org.gradle.daemon=true\norg.gradle.jvmargs=-Xmx2048M" >> ~/.gradle/gradle.properties

    # Run android emulator (first avd)
    npm run emulator

    # Make sure you have hw.keyboard=yes in your avd config.ini (in $HOME/.android/avd/.../) for reloading when pressing R twice to work.

## Create release build (Android)
    # Aquire the keystore and put it in android/app/dusken-client.keystore

    # Put these properties in ~/.gradle/gradle.properties along with the correct passwords
    DUSKEN_RELEASE_STORE_FILE=dusken-client.keystore
    DUSKEN_RELEASE_KEY_ALIAS=dusken-client
    DUSKEN_RELEASE_STORE_PASSWORD=
    DUSKEN_RELEASE_KEY_PASSWORD=

    # Build
    cd android && ./gradlew assembleRelease

    # Output is in android/app/build/outputs/apk

