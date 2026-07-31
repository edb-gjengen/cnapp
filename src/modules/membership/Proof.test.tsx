import { gql } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';

import Proof from '@/modules/membership/Proof';
import { renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

// The setup-wide stripe mock resolves initPaymentSheet/presentPaymentSheet
// with { error: null }; useStripe() hands out these same jest.fn instances.
const { initPaymentSheet, presentPaymentSheet } = jest.requireMock('@stripe/stripe-react-native') as {
  initPaymentSheet: jest.Mock;
  presentPaymentSheet: jest.Mock;
};

const fetchMock = global.fetch as jest.Mock;

const mockPaymentSheetResponse = () =>
  fetchMock.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ paymentIntent: 'pi_secret', ephemeralKey: 'ek_secret', customer: 'cus_123' }),
  });

// Must match PROOF_QUERY in useProof.tsx
const PROOF_QUERY = gql`
  {
    membershipTypes {
      slug
      price
    }
  }
`;

const apolloMocks = [
  {
    request: { query: PROOF_QUERY },
    result: {
      data: {
        membershipTypes: [
          { __typename: 'MembershipType', slug: 'student', price: 15000 },
          { __typename: 'MembershipType', slug: 'regular', price: 30000 },
          { __typename: 'MembershipType', slug: 'support', price: 50000 },
        ],
      },
    },
  },
];

const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

const expiredMember: UserType = {
  ...testUser,
  is_member: false,
  last_membership: { membership_type: 'standard', end_date: '2020-01-01' },
};

const renderProof = ({
  user = nonMember,
  fetchUser = jest.fn(),
  mocks = apolloMocks,
}: { user?: UserType; fetchUser?: () => void; mocks?: readonly MockedResponse[] } = {}) =>
  renderWithProviders(
    <Proof onLogoutPress={jest.fn()} fetchUser={fetchUser} isRefetching={false} onDeletePress={jest.fn()} />,
    {
      initialToken: 'test-token',
      initialUser: user,
      apolloMocks: mocks,
    },
  );

beforeEach(() => {
  jest.clearAllMocks();
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
});

it('disables the purchase button without showing a price while membership types load', async () => {
  const { getByRole, findByText } = renderProof();

  // The label carries no amount until the query resolves
  expect(getByRole('button', { name: 'Kjøp medlemskap' })).toBeDisabled();

  // Once the query resolves the real price takes over
  expect(await findByText('Kjøp medlemskap (300 NOK)')).toBeTruthy();
});

it('shows an error with retry instead of a price when membership types fail to load', async () => {
  const { findByText, getByText, getByRole } = renderProof({
    mocks: [{ request: { query: PROOF_QUERY }, error: new Error('network down') }, ...apolloMocks],
  });

  expect(await findByText('Kunne ikke hente priser')).toBeTruthy();
  expect(getByRole('button', { name: 'Kjøp medlemskap' })).toBeDisabled();

  // Retrying consumes the queued successful mock and recovers the real price
  fireEvent.press(getByText('Prøv igjen'));
  expect(await findByText('Kjøp medlemskap (300 NOK)')).toBeTruthy();
  expect(getByRole('button', { name: 'Kjøp medlemskap (300 NOK)' })).toBeEnabled();
});

it('purchases the preselected membership through the stripe payment sheet', async () => {
  mockPaymentSheetResponse();
  const { findByText } = renderProof();

  // 'Ordinær' (slug: regular) is preselected; the button enables once the
  // membership type query has resolved and its price is shown
  fireEvent.press(await findByText('Kjøp medlemskap (300 NOK)'));

  expect(await findByText('Your order is confirmed!')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledWith(
    'https://dusken.example.test/api/stripe/payment-sheet/',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ membership_type: 'regular' }),
      headers: expect.objectContaining({ Authorization: 'Token test-token' }),
    }),
  );
  expect(initPaymentSheet).toHaveBeenCalledWith(
    expect.objectContaining({
      paymentIntentClientSecret: 'pi_secret',
      customerEphemeralKeySecret: 'ek_secret',
      customerId: 'cus_123',
      defaultBillingDetails: expect.objectContaining({
        email: testUser.email,
        name: 'Test Testesen',
      }),
    }),
  );
  expect(presentPaymentSheet).toHaveBeenCalled();
});

it('purchases the selected membership type, not the default', async () => {
  mockPaymentSheetResponse();
  const { findByText } = renderProof();

  fireEvent.press(await findByText('Student'));
  fireEvent.press(await findByText('Kjøp medlemskap (150 NOK)'));

  expect(await findByText('Your order is confirmed!')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledWith(
    'https://dusken.example.test/api/stripe/payment-sheet/',
    expect.objectContaining({ body: JSON.stringify({ membership_type: 'student' }) }),
  );
});

it('shows the stripe error when the payment sheet is not completed', async () => {
  mockPaymentSheetResponse();
  presentPaymentSheet.mockResolvedValueOnce({
    error: { code: 'Canceled', message: 'The payment flow has been canceled' },
  });
  const { findByText, queryByText } = renderProof();

  fireEvent.press(await findByText('Kjøp medlemskap (300 NOK)'));

  expect(await findByText('Error code: Canceled The payment flow has been canceled')).toBeTruthy();
  expect(queryByText('Your order is confirmed!')).toBeNull();
});

it('shows an error and does not present the sheet when the backend rejects the purchase', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({ detail: 'Ugyldig medlemskapstype' }),
  });
  const { findByText, getByRole } = renderProof();

  fireEvent.press(await findByText('Kjøp medlemskap (300 NOK)'));

  expect(await findByText('Oops! Could not initialise payment')).toBeTruthy();
  expect(initPaymentSheet).not.toHaveBeenCalled();
  expect(presentPaymentSheet).not.toHaveBeenCalled();
  // The purchase button recovers so the user can retry
  expect(getByRole('button', { name: 'Kjøp medlemskap (300 NOK)' })).toBeEnabled();
});

it('shows an error and does not present the sheet when stripe fails to initialise it', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockPaymentSheetResponse();
  initPaymentSheet.mockResolvedValueOnce({ error: { code: 'Failed', message: 'Invalid client secret' } });
  const { findByText } = renderProof();

  fireEvent.press(await findByText('Kjøp medlemskap (300 NOK)'));

  expect(await findByText('Oops! Could not initialise payment')).toBeTruthy();
  expect(presentPaymentSheet).not.toHaveBeenCalled();
});

it('refetches user data when the stored membership has expired', async () => {
  const fetchUser = jest.fn();
  renderProof({ user: expiredMember, fetchUser });

  await waitFor(() => expect(fetchUser).toHaveBeenCalled());
  // Notification permission was never granted, so nothing is scheduled
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('cancels stale expiry notifications when permission is granted, without scheduling one in the past', async () => {
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  const fetchUser = jest.fn();
  renderProof({ user: expiredMember, fetchUser });

  // Once the granted permission resolves, the expiry effect runs the cleanup
  await waitFor(() => expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled());
  expect(fetchUser).toHaveBeenCalled();
  // The expiry date is in the past, so no new notification is scheduled
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});
