import { useStripe } from '@stripe/stripe-react-native';
import { useCallback, useRef, useEffect } from 'react';
import { Linking } from 'react-native';

export function usePrevious(value) {
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

/** Handles deep links. Currently only used by stripe */
export const useDeepLinking = () => {
  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url) => {
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
