import { useStripe } from '@stripe/stripe-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { logout } from './actions';
import type { AppDispatch, AppStore, RootState } from './reduxStore';

export function usePrevious<T>(value: T): T | undefined {
  const [previous, setPrevious] = useState<T | undefined>(undefined);
  const [current, setCurrent] = useState(value);

  // Adjust state during render instead of tracking the previous render's value in a ref,
  // see https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
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

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

/** Logout authenticated users without token */
export function useLogoutUsersWithNoToken() {
  const user = useAppSelector((store) => store.user);
  const userToken = useAppSelector((store) => store.userToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !userToken) {
      dispatch(logout());
    }
  });
}
