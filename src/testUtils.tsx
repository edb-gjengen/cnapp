import { InMemoryCache } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';

import rootReducer from '@/reducers';
import type { UserType } from '@/types/data';

type AppState = ReturnType<typeof rootReducer>;

const initialState: AppState = rootReducer(undefined, { type: '@@TEST_INIT' });

/** A member with an active membership, for screens that require a logged in user. */
export const testUser: UserType = {
  username: 'testbruker',
  email: 'test@example.test',
  first_name: 'Test',
  last_name: 'Testesen',
  is_member: true,
  is_volunteer: false,
  last_membership: {
    membership_type: 'standard',
    end_date: '2099-08-01',
  },
};

interface RenderWithProvidersOptions {
  initialToken?: string | null;
  initialUser?: UserType | null;
  apolloMocks?: readonly MockedResponse[];
}

/**
 * Renders a screen inside the providers it expects in the real app:
 * a fresh (non-persisted) Redux store, Apollo's MockedProvider and a
 * NavigationContainer.
 */
export function renderWithProviders(
  ui: ReactElement,
  { initialToken = null, initialUser = null, apolloMocks = [] }: RenderWithProvidersOptions = {},
) {
  const preloadedState: AppState = {
    ...initialState,
    userToken: initialToken,
    isAuthenticated: !!initialToken,
    user: initialUser,
  };
  const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

  return render(
    <MockedProvider mocks={apolloMocks} cache={new InMemoryCache()}>
      <Provider store={store}>
        <NavigationContainer>{ui}</NavigationContainer>
      </Provider>
    </MockedProvider>,
  );
}
