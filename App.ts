import * as Sentry from '@sentry/react-native';

import App from './src/App';

// The DSN is only set in EAS builds (see eas.json); dev builds don't report
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || undefined,
  enabled: !__DEV__,
  // Events go to our self-hosted Bugsink, so PII is ok and helps debugging
  sendDefaultPii: true,
});

export default Sentry.wrap(App);
