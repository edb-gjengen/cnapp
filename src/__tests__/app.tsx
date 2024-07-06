import 'react-native';
import { render } from '@testing-library/react-native';
import React from 'react';

import App from 'src/App';

it('renders correctly', () => {
  const { toJSON } = render(<App />);
  expect(toJSON()).toBeTruthy();
});
