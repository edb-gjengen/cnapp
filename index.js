import App from './src/App';
import { AppRegistry } from "react-native";
import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';

import {name as appName} from './app.json';

if(Config.SENTRY_DSN) {
    Sentry.config(Config.SENTRY_DSN).install();
}

AppRegistry.registerComponent(appName, () => App);
