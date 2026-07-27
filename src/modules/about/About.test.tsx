import React from 'react';

import About from '@/modules/about/About';
import { renderWithProviders } from '@/testUtils';

it('renders the about screen', () => {
  const { getByText } = renderWithProviders(<About />);

  expect(getByText('Åpningstider')).toBeTruthy();
  expect(getByText('Ta kontakt')).toBeTruthy();
});
