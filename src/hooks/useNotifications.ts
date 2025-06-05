import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  };

  const scheduleMembershipExpiryNotification = async (expiryDate: string) => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    // Cancel any existing notifications before scheduling a new one
    await Notifications.cancelAllScheduledNotificationsAsync();

    const expiryDateObj = new Date(expiryDate);
    const notificationDate = new Date(expiryDateObj);
    notificationDate.setDate(notificationDate.getDate() + 1); // 1 day after expiry

    // Don't schedule if the notification date is in the past
    if (notificationDate <= new Date()) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medlemskapet ditt har utløpt!',
        body: 'Ditt medlemskap i Det Norske Studentersamfund har utløpt! Vi håper du ønsker å fornye det :)',
        data: { type: 'membership_expiry' },
      },
      trigger: {
        type: 'date',
        date: notificationDate,
      },
    });
  };

  const toggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      // When enabling, request permission
      const granted = await requestPermission();
      return { success: granted, needsPermission: !granted };
    } else {
      // When disabling, cancel any existing notifications and update state
      await Notifications.cancelAllScheduledNotificationsAsync();
      setHasPermission(false);
      return { success: true, needsPermission: false };
    }
  };

  return {
    hasPermission,
    requestPermission,
    scheduleMembershipExpiryNotification,
    toggleNotifications,
  };
};
