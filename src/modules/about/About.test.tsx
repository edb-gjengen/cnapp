import React from 'react';

import About from 'src/modules/about/About';
import { renderWithProviders } from 'src/testUtils';

it('renders the about screen', () => {
  const { getByText } = renderWithProviders(<About />);

  expect(getByText('Åpningstider')).toBeTruthy();
  expect(getByText('Ta kontakt')).toBeTruthy();
});
