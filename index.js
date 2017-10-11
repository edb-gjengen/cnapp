import App from './src/App';
import { AppRegistry } from "react-native";
import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';

if(Config.SENTRY_DSN) {
    Sentry.config(Config.SENTRY_DSN).install();
}

AppRegistry.registerComponent('Dusken', () => App);