import { act, fireEvent, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';

import * as api from '@/api';
import Proof from '@/modules/membership/Proof';
import { renderWithProviders, testMembershipTypes, testUser } from '@/testUtils';
import type { MembershipTypeOption, UserType } from '@/types/data';

// The setup-wide stripe mock resolves initPaymentSheet/presentPaymentSheet
// with { error: null }; useStripe() hands out these same jest.fn instances.
const { initPaymentSheet, presentPaymentSheet } = jest.requireMock('@stripe/stripe-react-native') as {
  initPaymentSheet: jest.Mock;
  presentPaymentSheet: jest.Mock;
};

const mockPaymentSheet = () =>
  jest
    .spyOn(api, 'requestStripePaymentSheet')
    .mockResolvedValue({ paymentIntent: 'pi_secret', ephemeralKey: 'ek_secret', customer: 'cus_123' });

const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

const expiredMember: UserType = {
  ...testUser,
  is_member: false,
  last_membership: { membership_type: 'standard', end_date: '2020-01-01' },
};

const renderProof = ({
  user = nonMember,
  fetchUser = jest.fn(),
  membershipTypes,
}: { user?: UserType; fetchUser?: () => void; membershipTypes?: MembershipTypeOption[] | null } = {}) =>
  renderWithProviders(<Proof fetchUser={fetchUser} isRefetching={false} />, {
    initialToken: 'test-token',
    initialUser: user,
    initialMembershipTypes: membershipTypes,
  });

beforeEach(() => {
  jest.clearAllMocks();
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
});

it('disables the purchase button without showing a price while membership types load', async () => {
  // Hold the response so the loading state survives the async render
  let resolveMembershipTypes!: (types: MembershipTypeOption[]) => void;
  jest
    .spyOn(api, 'fetchMembershipTypes')
    .mockImplementationOnce(() => new Promise((resolve) => (resolveMembershipTypes = resolve)));
  const { getByRole, findByText } = await renderProof({ membershipTypes: null });

  // The label carries no amount until the query resolves
  expect(getByRole('button', { name: 'Kjøp medlemskap' })).toBeDisabled();

  // Once the query resolves the real price takes over
  await act(async () => {
    resolveMembershipTypes(testMembershipTypes);
  });
  expect(await findByText('Kjøp medlemskap (300 kr)')).toBeTruthy();
});

it('shows an error with retry instead of a price when membership types fail to load', async () => {
  jest
    .spyOn(api, 'fetchMembershipTypes')
    .mockRejectedValueOnce(new Error('network down'))
    .mockResolvedValue(testMembershipTypes);
  const { findByText, getByText, getByRole } = await renderProof({ membershipTypes: null });

  expect(await findByText('Kunne ikke hente priser')).toBeTruthy();
  expect(getByRole('button', { name: 'Kjøp medlemskap' })).toBeDisabled();

  // Retrying hits the recovered API and gets the real price
  await fireEvent.press(getByText('Prøv igjen'));
  expect(await findByText('Kjøp medlemskap (300 kr)')).toBeTruthy();
  expect(getByRole('button', { name: 'Kjøp medlemskap (300 kr)' })).toBeEnabled();
});

it('purchases the preselected membership through the stripe payment sheet', async () => {
  const requestPaymentSheet = mockPaymentSheet();
  const { findByText } = await renderProof();

  // 'Ordinær' (slug: regular) is preselected; the button enables once the
  // membership type query has resolved and its price is shown
  await fireEvent.press(await findByText('Kjøp medlemskap (300 kr)'));

  expect(await findByText('Your order is confirmed!')).toBeTruthy();
  expect(requestPaymentSheet).toHaveBeenCalledWith('test-token', 'regular');
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
  const requestPaymentSheet = mockPaymentSheet();
  const { findByText } = await renderProof();

  await fireEvent.press(await findByText('Student'));
  await fireEvent.press(await findByText('Kjøp medlemskap (150 kr)'));

  expect(await findByText('Your order is confirmed!')).toBeTruthy();
  expect(requestPaymentSheet).toHaveBeenCalledWith('test-token', 'student');
});

it('shows the stripe error when the payment sheet is not completed', async () => {
  mockPaymentSheet();
  presentPaymentSheet.mockResolvedValueOnce({
    error: { code: 'Canceled', message: 'The payment flow has been canceled' },
  });
  const { findByText, queryByText } = await renderProof();

  await fireEvent.press(await findByText('Kjøp medlemskap (300 kr)'));

  expect(await findByText('Error code: Canceled The payment flow has been canceled')).toBeTruthy();
  expect(queryByText('Your order is confirmed!')).toBeNull();
});

it('shows an error and does not present the sheet when the backend rejects the purchase', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(api, 'requestStripePaymentSheet').mockRejectedValueOnce(new Error('Ugyldig medlemskapstype'));
  const { findByText, getByRole } = await renderProof();

  await fireEvent.press(await findByText('Kjøp medlemskap (300 kr)'));

  expect(await findByText('Oops! Could not initialise payment')).toBeTruthy();
  expect(initPaymentSheet).not.toHaveBeenCalled();
  expect(presentPaymentSheet).not.toHaveBeenCalled();
  // The purchase button recovers so the user can retry
  expect(getByRole('button', { name: 'Kjøp medlemskap (300 kr)' })).toBeEnabled();
});

it('shows an error and does not present the sheet when stripe fails to initialise it', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockPaymentSheet();
  initPaymentSheet.mockResolvedValueOnce({ error: { code: 'Failed', message: 'Invalid client secret' } });
  const { findByText } = await renderProof();

  await fireEvent.press(await findByText('Kjøp medlemskap (300 kr)'));

  expect(await findByText('Oops! Could not initialise payment')).toBeTruthy();
  expect(presentPaymentSheet).not.toHaveBeenCalled();
});

it('refetches user data when the stored membership has expired', async () => {
  const fetchUser = jest.fn();
  await renderProof({ user: expiredMember, fetchUser });

  await waitFor(() => expect(fetchUser).toHaveBeenCalled());
  // Notification permission was never granted, so nothing is scheduled
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('cancels stale expiry notifications when permission is granted, without scheduling one in the past', async () => {
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  const fetchUser = jest.fn();
  await renderProof({ user: expiredMember, fetchUser });

  // Once the granted permission resolves, the expiry effect runs the cleanup
  await waitFor(() => expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled());
  expect(fetchUser).toHaveBeenCalled();
  // The expiry date is in the past, so no new notification is scheduled
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});
