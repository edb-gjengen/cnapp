import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { StripeProvider } from '@stripe/stripe-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';

import Constants from 'expo-constants';
import { loadTheme } from './theme';
import { useDeepLinking } from './hooks';

import Dusken from './Dusken';
import { store, persistor } from './reduxStore';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/graphql/` }),
  cache: new InMemoryCache(),
});
// FIXME: Replace unmaintained native-base with https://wix.github.io/react-native-ui-lib/ which produces this warning
LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);

loadTheme();

export default function App() {
  useDeepLinking();
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={apolloClient}>
            {/* FIXME: Read urlScheme and merchantIdentifier from .Config */}
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
              urlScheme={Constants.expoConfig.scheme}
              merchantIdentifier="merchant.no.neuf.chateau" // https://developer.apple.com/account/resources/identifiers/list/merchant
            >
              <Dusken />
            </StripeProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
/** YOLO */
