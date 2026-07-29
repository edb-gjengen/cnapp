import { fireEvent, waitFor, type RenderResult } from '@testing-library/react-native';
import React from 'react';

import UserRegister from '@/modules/register/UserRegister';
import { renderWithProviders } from '@/testUtils';

// The screen is pushed on top of Login and closes itself with goBack() once
// registration succeeds; stub the navigation object so we can assert on that.
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return { ...actual, useNavigation: () => ({ goBack: mockGoBack }) };
});

const fetchMock = global.fetch as jest.Mock;

const mockResponseOnce = (json: unknown, ok = true) =>
  fetchMock.mockResolvedValueOnce({ ok, status: ok ? 200 : 400, json: async () => json });

const validFormValues: Record<string, string> = {
  Fornavn: 'Grisen',
  Etternavn: 'Testesen',
  'E-post': 'grisen@example.test',
  Mobilnummer: '+4712345678',
  Passord: 'hunter2',
};

const fillForm = (getByLabelText: RenderResult['getByLabelText'], overrides: Record<string, string> = {}) => {
  Object.entries({ ...validFormValues, ...overrides }).forEach(([label, value]) => {
    fireEvent.changeText(getByLabelText(label), value);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the registration form', () => {
  const { getByText } = renderWithProviders(<UserRegister />);

  expect(getByText('Fornavn')).toBeTruthy();
  expect(getByText('E-post')).toBeTruthy();
  expect(getByText('Registrer meg')).toBeTruthy();
});

it('disables the submit button while the form is incomplete', () => {
  const { getByText, getByRole, store } = renderWithProviders(<UserRegister />);

  expect(getByRole('button', { name: 'Registrer meg' })).toBeDisabled();
  fireEvent.press(getByText('Registrer meg'));

  expect(fetchMock).not.toHaveBeenCalled();
  expect(store.getState().isRegisteringUser).toBe(false);
});

it('submits the form, authenticates and navigates back on success', async () => {
  mockResponseOnce({ username: 'grisen', email: 'grisen@example.test', auth_token: 'token-456' });
  const { getByText, getByRole, getByLabelText, store } = renderWithProviders(<UserRegister />);

  fillForm(getByLabelText);
  await waitFor(() => expect(getByRole('button', { name: 'Registrer meg' })).toBeEnabled());
  fireEvent.press(getByText('Registrer meg'));

  await waitFor(() => expect(store.getState().isAuthenticated).toBe(true));
  expect(fetchMock).toHaveBeenCalledWith(
    'https://dusken.example.test/api/user/register/',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        first_name: 'Grisen',
        last_name: 'Testesen',
        email: 'grisen@example.test',
        phone_number: '+4712345678',
        password: 'hunter2',
      }),
    }),
  );
  expect(store.getState().userToken).toBe('token-456');
  expect(mockGoBack).toHaveBeenCalled();
});

it('shows server field errors on the matching form field', async () => {
  mockResponseOnce({ email: ['Denne e-postadressen er allerede i bruk'] }, false);
  const { getByText, getByRole, getByLabelText, findByText, store } = renderWithProviders(<UserRegister />);

  fillForm(getByLabelText);
  await waitFor(() => expect(getByRole('button', { name: 'Registrer meg' })).toBeEnabled());
  fireEvent.press(getByText('Registrer meg'));

  expect(await findByText('Denne e-postadressen er allerede i bruk')).toBeTruthy();
  expect(store.getState().isAuthenticated).toBe(false);
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('rejects an invalid e-mail address without hitting the network', async () => {
  const { getByLabelText, findByText } = renderWithProviders(<UserRegister />);

  fillForm(getByLabelText, { 'E-post': 'not-an-email' });
  // Enter on the last field submits too, bypassing the disabled button
  fireEvent(getByLabelText('Passord'), 'submitEditing');

  expect(await findByText('er ikke en gyldig e-post')).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
});
