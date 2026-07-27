import React from 'react';

import EventList from '@/modules/events/EventList';
import { renderWithProviders } from '@/testUtils';
import { fetchWithTimeout } from '@/utils';

jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  fetchWithTimeout: jest.fn(),
}));

const mockFetch = fetchWithTimeout as jest.Mock;

const event = {
  id: '1',
  title: 'Lørdagsquiz',
  subtitle: 'Quiz med premier',
  url: 'https://example.test/events/1',
  futureOccurrencesCount: 1,
  nextOccurrence: {
    id: '11',
    start: '2026-08-01T19:00:00+02:00',
    venue: {
      id: '2',
      slug: 'storsalen',
      title: 'Storsalen',
      preposition: 'i',
      url: 'https://example.test/venues/storsalen',
    },
  },
};

it('renders events from the API', async () => {
  mockFetch.mockResolvedValue({ json: async () => ({ events: [event] }) });

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('Lørdagsquiz')).toBeTruthy();
});

it('renders an error state when the API is unreachable', async () => {
  mockFetch.mockRejectedValue(new Error('network down'));

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('Kunne ikke hente programmet...')).toBeTruthy();
});
