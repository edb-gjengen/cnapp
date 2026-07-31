import { useStripe } from '@stripe/stripe-react-native';
import { focusManager } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';

/** Drives TanStack Query's refetch-on-focus from the app's foreground state. */
export function useAppStateFocusManager() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);
}

/** Handles deep links. Currently only used by stripe */
export const useDeepLinking = () => {
  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (!url) {
        return;
      }

      // Pass url to stripe
      // Note: This return value can be used to target non-stripe URLs in the future
      await handleURLCallback(url);
    },
    [handleURLCallback],
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);
};
