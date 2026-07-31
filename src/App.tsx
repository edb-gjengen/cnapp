import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { StripeProvider } from '@stripe/stripe-react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';

import { AuthProvider } from '@/auth/AuthContext';
import { useDeepLinking } from '@/hooks';
import { appQueryClient, persistOptions } from '@/queries/queryClient';

import AppInner from './AppInner';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${process.env.EXPO_PUBLIC_DUSKEN_API_URL}/api/graphql/` }),
  cache: new InMemoryCache(),
});

export default function App() {
  useDeepLinking();
  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <PersistQueryClientProvider client={appQueryClient} persistOptions={persistOptions}>
        <AuthProvider>
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
        </AuthProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
