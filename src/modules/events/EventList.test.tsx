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

it('formats the next occurrence as a Norwegian date with the venue', async () => {
  mockFetch.mockResolvedValue({ json: async () => ({ events: [event] }) });

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('lø. 1. aug. 2026 kl. 19:00 i Storsalen')).toBeTruthy();
});

it('formats weekday and month abbreviations across the year', async () => {
  const events = [
    { ...event, id: '2', nextOccurrence: { ...event.nextOccurrence, start: '2026-12-30T18:00:00+01:00' } },
    { ...event, id: '3', nextOccurrence: { ...event.nextOccurrence, start: '2027-05-17T13:00:00+02:00' } },
  ];
  mockFetch.mockResolvedValue({ json: async () => ({ events }) });

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('on. 30. des. 2026 kl. 18:00 i Storsalen')).toBeTruthy();
  expect(await findByText('ma. 17. mai 2027 kl. 13:00 i Storsalen')).toBeTruthy();
});

it('renders venue-local (Oslo) time whatever the API offset and device timezone', async () => {
  // 17:00 UTC = 19:00 in Oslo (CEST); the suite runs under TZ=America/New_York
  const events = [{ ...event, nextOccurrence: { ...event.nextOccurrence, start: '2026-08-01T17:00:00Z' } }];
  mockFetch.mockResolvedValue({ json: async () => ({ events }) });

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('lø. 1. aug. 2026 kl. 19:00 i Storsalen')).toBeTruthy();
});

it('prefixes the time with Neste: when the event has more occurrences', async () => {
  mockFetch.mockResolvedValue({ json: async () => ({ events: [{ ...event, futureOccurrencesCount: 3 }] }) });

  const { findByText } = renderWithProviders(<EventList />);

  expect(await findByText('Neste: lø. 1. aug. 2026 kl. 19:00 i Storsalen')).toBeTruthy();
  expect(await findByText('Se flere tider (2)')).toBeTruthy();
});

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
