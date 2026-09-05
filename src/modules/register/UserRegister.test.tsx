import { act, fireEvent, waitFor, type RenderResult } from '@testing-library/react-native';
import React from 'react';

import * as api from '@/api';
import { ApiError } from '@/errors';
import UserRegister from '@/modules/register/UserRegister';
import { focusedFieldLabel, renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

// The screen is pushed on top of Login and closes itself with goBack() once
// registration succeeds; stub the navigation object so we can assert on that.
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return { ...actual, useNavigation: () => ({ goBack: mockGoBack }) };
});

const validFormValues: Record<string, string> = {
  Fornavn: 'Grisen',
  Etternavn: 'Testesen',
  'E-post': 'grisen@example.test',
  Mobilnummer: '+4712345678',
  Passord: 'hunter2',
};

const fillForm = async (getByLabelText: RenderResult['getByLabelText'], overrides: Record<string, string> = {}) => {
  for (const [label, value] of Object.entries({ ...validFormValues, ...overrides })) {
    await fireEvent.changeText(getByLabelText(label), value);
  }
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the registration form', async () => {
  const { getByText } = await renderWithProviders(<UserRegister />);

  expect(getByText('Fornavn')).toBeTruthy();
  expect(getByText('E-post')).toBeTruthy();
  expect(getByText('Registrer meg')).toBeTruthy();
});

it('disables the submit button while the form is incomplete', async () => {
  const registerUser = jest.spyOn(api, 'registerUser');
  const { getByText, getByRole, queryByRole } = await renderWithProviders(<UserRegister />);

  expect(getByRole('button', { name: 'Registrer meg' })).toBeDisabled();
  await fireEvent.press(getByText('Registrer meg'));

  expect(registerUser).not.toHaveBeenCalled();
  expect(queryByRole('progressbar')).toBeNull();
});

it('submits the form, shows a spinner while pending and navigates back on success', async () => {
  let resolveRegister!: (result: { user: UserType; token: string }) => void;
  const registerUser = jest
    .spyOn(api, 'registerUser')
    .mockImplementationOnce(() => new Promise((resolve) => (resolveRegister = resolve)));
  const { getByText, getByRole, getByLabelText } = await renderWithProviders(<UserRegister />);

  await fillForm(getByLabelText);
  await waitFor(() => expect(getByRole('button', { name: 'Registrer meg' })).toBeEnabled());
  await fireEvent.press(getByText('Registrer meg'));

  // the spinner shows while the request is in flight
  await waitFor(() => expect(getByRole('progressbar')).toBeTruthy());
  expect(registerUser).toHaveBeenCalledWith(
    expect.objectContaining({
      first_name: 'Grisen',
      last_name: 'Testesen',
      email: 'grisen@example.test',
      phone_number: '+4712345678',
      password: 'hunter2',
    }),
  );
  expect(mockGoBack).not.toHaveBeenCalled();

  await act(async () => {
    resolveRegister({ user: testUser, token: 'token-456' });
  });

  await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
});

it('shows server field errors on the matching form field', async () => {
  jest
    .spyOn(api, 'registerUser')
    .mockRejectedValueOnce(new ApiError({ email: ['Denne e-postadressen er allerede i bruk'] }, 400));
  const { getByText, getByRole, getByLabelText, findByText } = await renderWithProviders(<UserRegister />);

  await fillForm(getByLabelText);
  await waitFor(() => expect(getByRole('button', { name: 'Registrer meg' })).toBeEnabled());
  await fireEvent.press(getByText('Registrer meg'));

  expect(await findByText('Denne e-postadressen er allerede i bruk')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('moves focus down the form when a field is submitted from the keyboard', async () => {
  const { getByLabelText } = await renderWithProviders(<UserRegister />);
  const labels = ['Fornavn', 'Etternavn', 'E-post', 'Mobilnummer', 'Passord'];

  for (const [i, label] of labels.slice(0, -1).entries()) {
    await fireEvent(getByLabelText(label), 'submitEditing');
    // react-hook-form's setFocus defers the focus call to the next tick
    await waitFor(() => expect(focusedFieldLabel()).toBe(labels[i + 1]));
  }
});

it('shows a generic error when registration fails on the network', async () => {
  jest.spyOn(api, 'registerUser').mockRejectedValueOnce(new Error('network down'));
  const { getByText, getByRole, getByLabelText, findByText } = await renderWithProviders(<UserRegister />);

  await fillForm(getByLabelText);
  await waitFor(() => expect(getByRole('button', { name: 'Registrer meg' })).toBeEnabled());
  await fireEvent.press(getByText('Registrer meg'));

  expect(await findByText('Kunne ikke sende inn skjemaet! Prøv igjen senere...')).toBeTruthy();
  expect(mockGoBack).not.toHaveBeenCalled();
});

it('rejects an invalid e-mail address without submitting', async () => {
  const registerUser = jest.spyOn(api, 'registerUser');
  const { getByLabelText, findByText } = await renderWithProviders(<UserRegister />);

  await fillForm(getByLabelText, { 'E-post': 'not-an-email' });
  // Enter on the last field submits too, bypassing the disabled button
  await fireEvent(getByLabelText('Passord'), 'submitEditing');

  expect(await findByText('er ikke en gyldig e-post')).toBeTruthy();
  expect(registerUser).not.toHaveBeenCalled();
});
