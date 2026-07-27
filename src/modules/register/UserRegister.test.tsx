import React from 'react';

import UserRegister from '@/modules/register/UserRegister';
import { renderWithProviders } from '@/testUtils';

it('renders the registration form', () => {
  const { getByText } = renderWithProviders(<UserRegister />);

  expect(getByText('Fornavn')).toBeTruthy();
  expect(getByText('E-post')).toBeTruthy();
  expect(getByText('Registrer meg')).toBeTruthy();
});
