import { fireEvent, waitFor, type RenderResult } from '@testing-library/react-native';
import React from 'react';

import Login from '@/modules/login/Login';
import { renderWithProviders } from '@/testUtils';

// Login is pushed on top of Membership and closes itself with goBack() once
// authentication succeeds; stub the navigation object so we can assert on that.
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return { ...actual, useNavigation: () => ({ goBack: mockGoBack }) };
});

const fetchMock = global.fetch as jest.Mock;

const fillForm = (
  getByLabelText: RenderResult['getByLabelText'],
  { username = 'grisen@example.test', password = 'hunter2' } = {},
) => {
  fireEvent.changeText(getByLabelText('E-post / Brukernavn'), username);
  fireEvent.changeText(getByLabelText('Passord'), password);
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the login form', () => {
  const { getByText } = renderWithProviders(<Login />);

  expect(getByText('E-post / Brukernavn')).toBeTruthy();
  expect(getByText('Passord')).toBeTruthy();
  expect(getByText('Logg inn')).toBeTruthy();
  expect(getByText('Glemt passord?')).toBeTruthy();
});

it('logs in against the API and returns to the previous screen', async () => {
  fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ token: 'token-123' }) });
  const { getByText, getByLabelText } = renderWithProviders(<Login />);

  fillForm(getByLabelText);
  fireEvent.press(getByText('Logg inn'));

  await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  expect(fetchMock).toHaveBeenCalledWith(
    'https://dusken.example.test/auth/obtain-token/',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'grisen@example.test', password: 'hunter2' }),
    }),
  );
});

it('shows the server error when the credentials are rejected', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({ non_field_errors: ['Kan ikke logge inn med angitt brukernavn og passord'] }),
  });
  const { getByText, getByLabelText, findByText } = renderWithProviders(<Login />);

  fillForm(getByLabelText);
  fireEvent.press(getByText('Logg inn'));

  expect(await findByText('Kan ikke logge inn med angitt brukernavn og passord')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('shows a generic message when the request fails on the network', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  fetchMock.mockRejectedValueOnce(new Error('network down'));
  const { getByText, getByLabelText, findByText } = renderWithProviders(<Login />);

  fillForm(getByLabelText);
  fireEvent.press(getByText('Logg inn'));

  expect(await findByText('Kunne ikke sende inn skjemaet! Prøv igjen senere...')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('logs in a dev-fake user without hitting the network', async () => {
  const { getByText, getByLabelText } = renderWithProviders(<Login />);

  fillForm(getByLabelText, { username: 'member', password: 'whatever' });
  fireEvent.press(getByText('Logg inn'));

  await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  expect(fetchMock).not.toHaveBeenCalled();
});
