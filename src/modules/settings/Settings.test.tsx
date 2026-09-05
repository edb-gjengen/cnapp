import { fireEvent, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Linking } from 'react-native';

import Settings from '@/modules/settings/Settings';
import { renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const NOTIFICATION_LABEL = 'Varsle meg når medlemskapet utløper';

const renderSettings = ({ user = testUser, token = 'test-token' }: { user?: UserType; token?: string | null } = {}) =>
  renderWithProviders(<Settings />, { initialToken: token, initialUser: token ? user : null });

beforeEach(() => {
  jest.clearAllMocks();
  // Back to the setup-wide defaults, since earlier tests may have overridden them
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
  (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
});

it('lists the account, reminder and privacy rows for a member', async () => {
  const { findByText, getByText, getByRole } = await renderSettings();

  expect(await findByText('Test Testesen')).toBeTruthy();
  expect(getByText('test@example.test')).toBeTruthy();
  expect(getByRole('switch', { name: NOTIFICATION_LABEL })).toBeTruthy();
  expect(getByRole('link', { name: 'Personvern' })).toBeTruthy();
  expect(getByRole('button', { name: 'Logg ut' })).toBeTruthy();
  expect(getByRole('button', { name: 'Slett bruker' })).toBeTruthy();
});

it('has no reminder switch for a non-member', async () => {
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };
  const { findByText, queryByRole, queryByText } = await renderSettings({ user: nonMember });

  expect(await findByText('Test Testesen')).toBeTruthy();
  expect(queryByText('Varsler')).toBeNull();
  expect(queryByRole('switch')).toBeNull();
});

it('falls back to the email when the account has no name', async () => {
  const nameless: UserType = { ...testUser, first_name: '', last_name: '' };
  const { findAllByText } = await renderSettings({ user: nameless });

  // Shown once as the title, not repeated as the email line
  expect(await findAllByText('test@example.test')).toHaveLength(1);
});

it('logs out and returns to the membership screen', async () => {
  const { findByText, queryByText } = await renderSettings();

  await fireEvent.press(await findByText('Logg ut'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' }));
  expect(queryByText('Test Testesen')).toBeNull();
});

it('opens the delete account screen', async () => {
  const { findByText } = await renderSettings();

  await fireEvent.press(await findByText('Slett bruker'));

  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'UserDelete' });
});

it('opens the privacy policy', async () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const { findByText } = await renderSettings();

  await fireEvent.press(await findByText('Personvern'));

  expect(openURL).toHaveBeenCalledWith('https://dusken.example.test/nb/personvern/');
});

it('asks for permission and explains when notifications are denied', async () => {
  const { findByRole, findByText } = await renderSettings();

  await fireEvent(await findByRole('switch'), 'valueChange', true);

  expect(await findByText('Du må godta varsler i innstillinger for å motta påminnelser')).toBeTruthy();
  expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('schedules the expiry reminder when notifications are allowed', async () => {
  (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  const { findByRole, queryByText } = await renderSettings();

  await fireEvent(await findByRole('switch'), 'valueChange', true);

  await waitFor(() => expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled());
  // Stale reminders go before the new one
  expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
    expect.objectContaining({
      content: expect.objectContaining({ title: 'Medlemskapet ditt har utløpt!' }),
      trigger: expect.objectContaining({ type: 'date' }),
    }),
  );
  expect(queryByText('Du må godta varsler i innstillinger for å motta påminnelser')).toBeNull();
});

it('cancels the reminder when the switch is turned off', async () => {
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  const { findByRole } = await renderSettings();

  await fireEvent(await findByRole('switch'), 'valueChange', false);

  await waitFor(() => expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled());
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('leaves for the membership screen when logged out', async () => {
  await renderSettings({ token: null });

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' }));
});
