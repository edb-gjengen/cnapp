import { AppRegistry } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

import App from './src/App';

import { name as appName } from './app.json';

if (Config.SENTRY_DSN) {
  Sentry.init({ dsn: Config.SENTRY_DSN });
}

AppRegistry.registerComponent(appName, () => App);
