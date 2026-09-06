import { fireEvent, waitFor, type RenderResult } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';

import * as api from '@/api';
import { ApiError } from '@/errors';
import Login from '@/modules/login/Login';
import { focusedFieldLabel, renderWithProviders } from '@/testUtils';

// Login is pushed on top of Membership and closes itself with goBack() once
// authentication succeeds; stub the navigation object so we can assert on that.
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return { ...actual, useNavigation: () => ({ goBack: mockGoBack }) };
});

const fillForm = async (
  getByLabelText: RenderResult['getByLabelText'],
  { username = 'grisen@example.test', password = 'hunter2' } = {},
) => {
  await fireEvent.changeText(getByLabelText('E-post / Brukernavn'), username);
  await fireEvent.changeText(getByLabelText('Passord'), password);
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the login form', async () => {
  const { getByText, getByTestId } = await renderWithProviders(<Login />);

  expect(getByText('E-post / Brukernavn')).toBeTruthy();
  expect(getByText('Passord')).toBeTruthy();
  expect(getByText('Logg inn')).toBeTruthy();
  expect(getByText('Glemt passord?')).toBeTruthy();
  expect(getByTestId('key-pig')).toBeTruthy();
});

it('moves focus to the password field when the username is submitted from the keyboard', async () => {
  const { getByLabelText } = await renderWithProviders(<Login />);

  await fireEvent(getByLabelText('E-post / Brukernavn'), 'submitEditing');

  // react-hook-form's setFocus defers the focus call to the next tick
  await waitFor(() => expect(focusedFieldLabel()).toBe('Passord'));
});

it('opens the forgot password page in the browser', async () => {
  const { getByText } = await renderWithProviders(<Login />);

  await fireEvent.press(getByText('Glemt passord?'));

  // Not one of our own domains in the test env, so no UTM tagging (covered in utils.test.ts)
  expect(Linking.openURL).toHaveBeenCalledWith('https://dusken.example.test/auth/password_reset/');
});

it('logs in against the API and returns to the previous screen', async () => {
  const login = jest.spyOn(api, 'login').mockResolvedValue({ token: 'token-123' });
  const { getByText, getByLabelText } = await renderWithProviders(<Login />);

  await fillForm(getByLabelText);
  await fireEvent.press(getByText('Logg inn'));

  await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  expect(login).toHaveBeenCalledWith('grisen@example.test', 'hunter2');
});

it('shows the server error when the credentials are rejected', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const invalidCredentials = new ApiError(
    { non_field_errors: ['Kan ikke logge inn med angitt brukernavn og passord'] },
    400,
  );
  jest.spyOn(api, 'login').mockRejectedValueOnce(invalidCredentials);
  const { getByText, getByLabelText, findByText } = await renderWithProviders(<Login />);

  await fillForm(getByLabelText);
  await fireEvent.press(getByText('Logg inn'));

  expect(await findByText('Kan ikke logge inn med angitt brukernavn og passord')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('shows a generic message when the request fails on the network', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(api, 'login').mockRejectedValueOnce(new Error('network down'));
  const { getByText, getByLabelText, findByText } = await renderWithProviders(<Login />);

  await fillForm(getByLabelText);
  await fireEvent.press(getByText('Logg inn'));

  expect(await findByText('Kunne ikke sende inn skjemaet! Prøv igjen senere...')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('logs in a dev-fake user without hitting the network', async () => {
  const { getByText, getByLabelText } = await renderWithProviders(<Login />);

  await fillForm(getByLabelText, { username: 'member', password: 'whatever' });
  await fireEvent.press(getByText('Logg inn'));

  await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  expect(global.fetch).not.toHaveBeenCalled();
});
