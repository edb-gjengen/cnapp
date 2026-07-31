import { deleteUser, fetchEvents, fetchUserData, login, registerUser, requestStripePaymentSheet } from '@/api';
import { ApiError } from '@/errors';

const fetchMock = global.fetch as jest.Mock;

const mockResponseOnce = (json: unknown, ok = true, status = ok ? 200 : 400) =>
  fetchMock.mockResolvedValueOnce({ ok, status, json: async () => json });

beforeEach(() => {
  fetchMock.mockClear();
});

const registerFormValues = {
  first_name: 'Grisen',
  last_name: 'Testersen',
  email: 'grisen@example.test',
  phone_number: '+4712345678',
  password: 'hunter2',
};

describe('login', () => {
  it('posts credentials and resolves with the token', async () => {
    mockResponseOnce({ token: 'token-123' });

    await expect(login('grisen', 'hunter2')).resolves.toEqual({ token: 'token-123' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/auth/obtain-token/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'grisen', password: 'hunter2' }),
      }),
    );
  });

  it('throws an ApiError carrying the DRF body on a rejected login', async () => {
    const apiError = { non_field_errors: ['Kan ikke logge inn med disse opplysningene'] };
    mockResponseOnce(apiError, false);

    const error = await login('grisen', 'wrong-password').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ fields: apiError, status: 400 });
  });

  it('falls back to the generic Norwegian body when the API returns an empty body', async () => {
    mockResponseOnce(null, false);

    const error = await login('grisen', 'hunter2').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.fields).toEqual({ non_field_errors: ['Kunne ikke logge inn, prøv igjen'] });
  });

  it('short-circuits dev fake users without hitting the network', async () => {
    await expect(login('member', 'any-password')).resolves.toEqual({ token: 'dev-fake-token:member' });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects with the raw error, not an ApiError, on network failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));

    const error = await login('grisen', 'hunter2').catch((e) => e);

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ApiError);
  });
});

describe('fetchUserData', () => {
  it('fetches /api/me/ with the auth token', async () => {
    const user = { username: 'grisen', email: 'grisen@example.test', is_member: true };
    mockResponseOnce(user);

    await expect(fetchUserData('token-123')).resolves.toEqual(user);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/me/',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Token token-123' }),
      }),
    );
  });

  it('resolves dev fake tokens without hitting the network', async () => {
    const user = await fetchUserData('dev-fake-token:nonmember');

    expect(user.is_member).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws an ApiError with the status, so a 401 is recognizable', async () => {
    mockResponseOnce({ detail: 'Ugyldig token.' }, false, 401);

    const error = await fetchUserData('revoked-token').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401, fields: { detail: 'Ugyldig token.' } });
  });
});

describe('registerUser', () => {
  it('splits the auth_token from the returned user', async () => {
    mockResponseOnce({ username: 'grisen', email: 'grisen@example.test', auth_token: 'token-456' });

    await expect(registerUser(registerFormValues)).resolves.toEqual({
      user: { username: 'grisen', email: 'grisen@example.test' },
      token: 'token-456',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/user/register/',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(registerFormValues) }),
    );
  });

  it('throws an ApiError carrying field errors', async () => {
    const apiError = { email: ['Denne e-postadressen er allerede i bruk'] };
    mockResponseOnce(apiError, false);

    const error = await registerUser(registerFormValues).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.fields).toEqual(apiError);
  });
});

describe('deleteUser', () => {
  it('sends DELETE with the auth token and resolves on success', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 204 });

    await expect(deleteUser('token-123')).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dusken.example.test/api/me/delete/',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({ Authorization: 'Token token-123' }),
      }),
    );
  });

  it('throws an ApiError carrying the detail body on failure', async () => {
    mockResponseOnce({ detail: 'Kan ikke slette bruker med aktivt medlemskap' }, false);

    const error = await deleteUser('token-123').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.fields).toEqual({ detail: 'Kan ikke slette bruker med aktivt medlemskap' });
  });
});

describe('fetchEvents', () => {
  it('resolves the events list', async () => {
    const events = [{ id: '1', title: 'Lørdagsquiz' }];
    mockResponseOnce({ events });

    await expect(fetchEvents()).resolves.toEqual(events);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://events.example.test/api/v1/events?view=compact-app',
      expect.anything(),
    );
  });

  it('throws when the API reports an error', async () => {
    mockResponseOnce({ error: 'oops' });

    await expect(fetchEvents()).rejects.toThrow('Kunne ikke hente programmet');
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
