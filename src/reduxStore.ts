import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['isLoggingIn', 'isFetchingUserData', 'isRegisteringUser', 'loginError'],
  // redux-persist never clears its 5s rehydration-watchdog timer, which keeps
  // Jest workers alive after tests finish; 0 disables it. The mocked
  // AsyncStorage rehydrates instantly, so the watchdog protects nothing there.
  timeout: process.env.NODE_ENV === 'test' ? 0 : undefined,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(...[thunk]));
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
