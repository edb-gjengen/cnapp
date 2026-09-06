import * as Notifications from 'expo-notifications';
import React from 'react';
import { Switch } from 'react-native';

import ListRow from '@/components/ListRow';
import { useNotifications } from '@/hooks/useNotifications';
import theme from '@/theme';

const LABEL = 'Varsle meg når medlemskapet utløper';

type NotificationRowProps = {
  /** end_date of the current membership, the reminder fires the day after */
  expiryDate: string;
  showToast: (message: string) => void;
};

const NotificationRow = ({ expiryDate, showToast }: NotificationRowProps) => {
  const { hasPermission, toggleNotifications, scheduleMembershipExpiryNotification } = useNotifications();

  const handleToggle = async (enabled: boolean) => {
    const { success, needsPermission } = await toggleNotifications(enabled);
    if (needsPermission) {
      await Notifications.requestPermissionsAsync();
      showToast('Du må godta varsler i innstillinger for å motta påminnelser');
      return;
    }
    if (success && enabled) {
      await scheduleMembershipExpiryNotification(expiryDate);
    }
  };

  return (
    <ListRow
      label={LABEL}
      accessory={
        <Switch
          accessibilityLabel={LABEL}
          value={hasPermission || false}
          onValueChange={handleToggle}
          trackColor={{ false: theme.colors.chateauBlue05, true: theme.colors.goldenOrange }}
          thumbColor={theme.colors.white}
          ios_backgroundColor={theme.colors.chateauBlue05}
        />
      }
    />
  );
};

export default NotificationRow;
