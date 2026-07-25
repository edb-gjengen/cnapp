import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import App from 'src/App';

it('renders the whole app without crashing', async () => {
  const view = render(<App />);
  await waitFor(() => expect(view.toJSON()).toBeTruthy());
});
