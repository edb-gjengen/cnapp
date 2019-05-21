/* global fetch */
import AsyncStorage from '@react-native-community/async-storage';

export function snakeToCamelCase(val) {
  return val.replace(/_([a-z])/g, function(g) {
    return g[1].toUpperCase();
  });
}

export function fetchWithTimeout(url, options, timeout = 10000) {
  /** Wraps fetch to allow it to time out */
  // FIXME: show timeout message in UI
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch request timed out')), timeout)),
  ]);
}

export async function migrateReduxPersistFourToFive(registerUserSuccess) {
  const authedKey = 'reduxPersist:isAuthenticated';
  const userKey = 'reduxPersist:user';
  const userTokenKey = 'reduxPersist:userToken';
  const v4Keys = [authedKey, userKey, userTokenKey];

  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (v4Keys.some((key) => !asyncStorageKeys.includes(key))) {
    return;
  }

  const isAuthenticated = await AsyncStorage.getItem(authedKey);
  console.log(authedKey, isAuthenticated);
  if (isAuthenticated !== 'true') {
    await AsyncStorage.multiRemove(v4Keys);
    return;
  }

  const userToken = await AsyncStorage.getItem(userTokenKey);
  const user = await AsyncStorage.getItem(userKey);
  console.log(userKey, user, JSON.parse(user));
  registerUserSuccess({ auth_token: userToken, ...JSON.parse(user) });
  await AsyncStorage.multiRemove(v4Keys);
  console.log('successfully migrated to new redux-persist');
}
