import { StripeProvider } from '@stripe/stripe-react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
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

export default function App() {
  useDeepLinking();
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar style="light" />
        <PersistQueryClientProvider client={appQueryClient} persistOptions={persistOptions}>
          <AuthProvider>
            {/* FIXME: Read urlScheme and merchantIdentifier from .Config */}
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
              urlScheme={Constants.expoConfig?.scheme as string}
              merchantIdentifier="merchant.no.neuf.chateau" // https://developer.apple.com/account/resources/identifiers/list/merchant
            >
              <AppInner />
            </StripeProvider>
          </AuthProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
