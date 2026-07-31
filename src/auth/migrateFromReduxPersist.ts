import AsyncStorage from '@react-native-async-storage/async-storage';

import { getStoredToken, setStoredToken } from '@/auth/tokenStorage';
import type { UserType } from '@/types/data';

const REDUX_PERSIST_KEY = 'persist:root';

interface MigratedAuth {
  token: string | null;
  user: UserType | null;
}

const LOGGED_OUT: MigratedAuth = { token: null, user: null };

/**
 * One-shot move of the session out of the redux-persist blob into
 * tokenStorage.
 * The blob is only removed once the token is safely stored or provably
 * absent, so failures retry next launch.
 */
export async function migrateReduxPersistAuth(): Promise<MigratedAuth> {
  let blob: string | null;
  try {
    blob = await AsyncStorage.getItem(REDUX_PERSIST_KEY);
  } catch {
    return LOGGED_OUT;
  }
  if (blob === null) {
    return LOGGED_OUT;
  }

  // The blob is a JSON object whose values are each their own JSON document
  let token: string | null = null;
  let user: UserType | null = null;
  try {
    const root = JSON.parse(blob);
    const innerToken = JSON.parse(root.userToken);
    if (typeof innerToken === 'string') {
      token = innerToken;
      try {
        const innerUser = JSON.parse(root.user);
        if (innerUser && typeof innerUser === 'object') {
          user = innerUser;
        }
      } catch {
        // The token still migrates; a refetch covers the user
      }
    }
  } catch {
    // Unparseable blob or no token → logged out
  }

  if (token !== null) {
    try {
      const existingToken = await getStoredToken();
      if (existingToken !== null) {
        // An earlier run already migrated; don't overwrite, don't seed
        token = existingToken;
        user = null;
      } else {
        await setStoredToken(token);
      }
    } catch {
      // The token never reached its new home; keep the blob for a retry
      return LOGGED_OUT;
    }
  }

  try {
    await AsyncStorage.removeItem(REDUX_PERSIST_KEY);
  } catch {
    // Re-runs next launch
  }

  return { token, user };
}
