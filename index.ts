// FIXME: This is never loaded by expo
import { AppRegistry } from 'react-native';
// import * as Sentry from '@sentry/react-native';

import { expo as expoConfig } from './app.json';
import App from './src/App';

// if (Config.SENTRY_DSN) {
//   Sentry.init({ dsn: Config.SENTRY_DSN });
// }

AppRegistry.registerComponent(expoConfig.name, () => App);
