import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'expo-dev-client';

import AppInner from './AppInner';
import { useDeepLinking } from './hooks';
import { store, persistor } from './reduxStore';
import { loadTheme } from './theme';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/graphql/` }),
  cache: new InMemoryCache(),
});

loadTheme();

export default function App() {
  useDeepLinking();
  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={apolloClient}>
            {/* FIXME: Read urlScheme and merchantIdentifier from .Config */}
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
              urlScheme={Constants.expoConfig?.scheme as string}
              merchantIdentifier="merchant.no.neuf.chateau" // https://developer.apple.com/account/resources/identifiers/list/merchant
            >
              <AppInner />
            </StripeProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
/** YOLO */
