import React from 'react';

import Login from 'src/modules/login/Login';
import { renderWithProviders } from 'src/testUtils';

it('renders the login form', () => {
  const { getByText } = renderWithProviders(<Login />);

  expect(getByText('E-post / Brukernavn')).toBeTruthy();
  expect(getByText('Passord')).toBeTruthy();
  expect(getByText('Logg inn')).toBeTruthy();
  expect(getByText('Glemt passord?')).toBeTruthy();
});
