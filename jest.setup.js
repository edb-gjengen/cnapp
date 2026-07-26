/* eslint-disable no-undef */

process.env.EXPO_PUBLIC_EVENT_API_URL = 'https://events.example.test/api/v1/events';
process.env.EXPO_PUBLIC_DUSKEN_API_URL = 'https://dusken.example.test';
process.env.EXPO_PUBLIC_DUSKEN_FORGOT_PASSWORD_URL = 'https://dusken.example.test/auth/password_reset/';
process.env.EXPO_PUBLIC_DUSKEN_PRIVACY_POLICY_URL = 'https://dusken.example.test/nb/personvern/';
process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_fake';

// No test may hit the network. Individual tests override this (or mock
// fetchWithTimeout in src/utils) when they need specific responses.
global.fetch = jest.fn(async () => ({
  ok: true,
  status: 200,
  json: async () => ({ events: [] }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@stripe/stripe-react-native', () => require('@stripe/stripe-react-native/jest/mock.js'));

// Reanimated (even its mock) initializes the native side of worklets at import
// time; substitute the mock that ships with react-native-worklets.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// jest-expo stubs the native side of expo-notifications with functions that
// resolve to undefined, which crashes destructuring like `const { status } = ...`.
jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ status: 'undetermined' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'denied' })),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}),
  scheduleNotificationAsync: jest.fn(async () => 'notification-id'),
}));

// Visual only, and old enough that it fights with the test renderer.
jest.mock('react-native-confetti', () => {
  const React = require('react');
  return class Confetti extends React.Component {
    startConfetti() {}

    stopConfetti() {}

    render() {
      return null;
    }
  };
});
