import AsyncStorage from '@react-native-async-storage/async-storage';

import { getStoredToken, setStoredToken } from '@/auth/tokenStorage';

beforeEach(async () => {
  await AsyncStorage.clear();
});

it('returns null when no token is stored', async () => {
  expect(await getStoredToken()).toBeNull();
});

it('round-trips a token through AsyncStorage', async () => {
  await setStoredToken('token-123');

  expect(await getStoredToken()).toBe('token-123');
  expect(await AsyncStorage.getItem('cnapp.authToken')).toBe('token-123');
});

it('removes the token when set to null', async () => {
  await setStoredToken('token-123');
  await setStoredToken(null);

  expect(await getStoredToken()).toBeNull();
  expect(await AsyncStorage.getItem('cnapp.authToken')).toBeNull();
});
