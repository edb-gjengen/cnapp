import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ListRow from '@/components/ListRow';
import ListSection from '@/components/ListSection';
import Toast from '@/components/Toast';
import theme from '@/theme';
import { displayName } from '@/utils';

import NotificationRow from './NotificationRow';
import useSettings from './useSettings';

const Settings = () => {
  const { user, onLogoutPress, onDeletePress, onPrivacyPress } = useSettings();
  const [toast, setToast] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const name = displayName(user);
  // Nothing to remind about without a current membership
  const membershipEndDate = user.is_member ? user.last_membership?.end_date : undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profile}>
          <Text style={[theme.text, styles.name]}>{name}</Text>
          {name !== user.email && <Text style={styles.email}>{user.email}</Text>}
        </View>
        {membershipEndDate && (
          <ListSection title="Varsler">
            <NotificationRow expiryDate={membershipEndDate} showToast={setToast} />
          </ListSection>
        )}
        <ListSection>
          <ListRow label="Personvern" arrow accessibilityRole="link" onPress={onPrivacyPress} />
          <ListRow label="Logg ut" onPress={onLogoutPress} />
        </ListSection>
        <ListSection>
          <ListRow label="Slett bruker" destructive onPress={onDeletePress} />
        </ListSection>
      </ScrollView>
      <Toast
        message={toast ?? undefined}
        visible={toast !== null}
        position="bottom"
        autoDismiss={3000}
        onDismiss={() => setToast(null)}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  profile: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  name: {
    ...theme.typography.h3,
    textAlign: 'center',
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.chateauBlue05,
    marginTop: 4,
    textAlign: 'center',
  },
});
