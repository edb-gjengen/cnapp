import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';

import {
  requestDeleteUser,
  requestLogin,
  requestRegisterUser,
  requestStripePaymentSheet,
  requestUserData,
} from '@/api';
import rootReducer from '@/reducers';

const createTestStore = () => createStore(rootReducer, undefined, applyMiddleware(thunk));

const fetchMock = global.fetch as jest.Mock;

const mockResponseOnce = (json: unknown, ok = true) =>
  fetchMock.mockResolvedValueOnce({ ok, status: ok ? 200 : 400, json: async () => json });

beforeEach(() => {
  fetchMock.mockClear();
});

describe('dev fake users (__DEV__ only)', () => {
  it.each([
    ['nonmember', false],
    ['member', true],
  ])('logs in "%s" with a fake user without hitting the network', async (username, isMember) => {
    const store = createTestStore();

    await store.dispatch(requestLogin(username as string, 'any-password'));
    expect(store.getState().isAuthenticated).toBe(true);

    await store.dispatch(requestUserData(store.getState().userToken ?? ''));
    expect(store.getState().user?.is_member).toBe(isMember);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('requestLogin', () => {
  it('posts credentials and stores the token on success', async () => {
    const store = createTestStore();
    mockResponseOnce({ token: 'token-123' });

    await store.dispatch(requestLogin('grisen', 'hunter2'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/auth/obtain-token/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'grisen', password: 'hunter2' }),
      }),
    );
    expect(store.getState()).toMatchObject({
      isAuthenticated: true,
      isLoggingIn: false,
      userToken: 'token-123',
      loginError: null,
    });
  });

  it('stores the API error body on a rejected login', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const store = createTestStore();
    const apiError = { non_field_errors: ['Kan ikke logge inn med disse opplysningene'] };
    mockResponseOnce(apiError, false);

    await store.dispatch(requestLogin('grisen', 'wrong-password'));

    expect(store.getState()).toMatchObject({
      isAuthenticated: false,
      isLoggingIn: false,
      userToken: null,
      loginError: apiError,
    });
  });

  it('falls back to a generic error message when the API returns an empty body', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const store = createTestStore();
    mockResponseOnce(null, false);

    await store.dispatch(requestLogin('grisen', 'hunter2'));

    expect(store.getState().loginError).toEqual({ non_field_errors: ['Kunne ikke logge inn, prøv igjen'] });
  });
});

describe('requestUserData', () => {
  it('fetches /api/me/ with the auth token and stores the user', async () => {
    const store = createTestStore();
    const user = { username: 'grisen', email: 'grisen@example.test', is_member: true };
    mockResponseOnce(user);

    await store.dispatch(requestUserData('token-123'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/me/',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Token token-123' }),
      }),
    );
    expect(store.getState()).toMatchObject({ isFetchingUserData: false, user });
  });

  it('stores the API error body when fetching user data fails', async () => {
    const store = createTestStore();
    const apiError = { detail: 'Ugyldig token.' };
    mockResponseOnce(apiError, false);

    await store.dispatch(requestUserData('expired-token'));

    expect(store.getState()).toMatchObject({ isFetchingUserData: false, user: null, userError: apiError });
  });
});

describe('requestRegisterUser', () => {
  const formValues = {
    first_name: 'Grisen',
    last_name: 'Testersen',
    email: 'grisen@example.test',
    phone_number: '+4712345678',
    password: 'hunter2',
  };

  it('authenticates with the returned auth_token and stores the user without it', async () => {
    const store = createTestStore();
    mockResponseOnce({ username: 'grisen', email: 'grisen@example.test', auth_token: 'token-456' });

    await store.dispatch(requestRegisterUser(formValues));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/user/register/',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(formValues) }),
    );
    expect(store.getState()).toMatchObject({
      isRegisteringUser: false,
      isAuthenticated: true,
      userToken: 'token-456',
      user: { username: 'grisen', email: 'grisen@example.test' },
    });
    expect(store.getState().user).not.toHaveProperty('auth_token');
  });

  it('stores field errors from the API when registration fails', async () => {
    const store = createTestStore();
    const apiError = { email: ['Denne e-postadressen er allerede i bruk'] };
    mockResponseOnce(apiError, false);

    await store.dispatch(requestRegisterUser(formValues));

    expect(store.getState()).toMatchObject({
      isRegisteringUser: false,
      isAuthenticated: false,
      registerError: apiError,
    });
  });
});

describe('requestDeleteUser', () => {
  it('resets the store to its initial state on success', async () => {
    const store = createTestStore();
    // Authenticate first (via the fake-user shortcut) so the reset is observable
    await store.dispatch(requestLogin('member', 'any-password'));
    expect(store.getState().isAuthenticated).toBe(true);

    mockResponseOnce({});
    await store.dispatch(requestDeleteUser('token-123'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/me/delete/',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({ Authorization: 'Token token-123' }),
      }),
    );
    expect(store.getState()).toMatchObject({ isAuthenticated: false, userToken: null, user: null });
  });

  it('stores the API error body when deletion fails', async () => {
    const store = createTestStore();
    const apiError = { detail: 'Kan ikke slette bruker med aktivt medlemskap' };
    mockResponseOnce(apiError, false);

    await store.dispatch(requestDeleteUser('token-123'));

    expect(store.getState()).toMatchObject({ isDeletingUser: false, deleteUserError: apiError });
  });
});

describe('requestStripePaymentSheet', () => {
  it('posts the membership type and returns the payment sheet parameters', async () => {
    const sheet = { paymentIntent: 'pi_secret', ephemeralKey: 'ek_secret', customer: 'cus_123' };
    mockResponseOnce(sheet);

    await expect(requestStripePaymentSheet('token-123', 'standard')).resolves.toEqual(sheet);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/stripe/payment-sheet/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ membership_type: 'standard' }),
        headers: expect.objectContaining({ Authorization: 'Token token-123' }),
      }),
    );
  });

  it('rejects with the API detail message on failure', async () => {
    mockResponseOnce({ detail: 'Ugyldig medlemskapstype' }, false);

    await expect(requestStripePaymentSheet('token-123', 'bogus')).rejects.toThrow('Ugyldig medlemskapstype');
  });

  it('rejects with a generic message when the API gives no detail', async () => {
    mockResponseOnce({}, false);

    await expect(requestStripePaymentSheet('token-123', 'standard')).rejects.toThrow(
      'Kunne ikke belaste bankkortet, prøv igjen',
    );
  });
});
