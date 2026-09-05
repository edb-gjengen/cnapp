import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import PrivacyButton from '@/components/PrivacyButton';
import theme from '@/theme';

import MembershipInfo from './MembershipInfo';
import Proof from './Proof';
import useMembership from './useMembership';

const Membership = () => {
  const { isPending, isRefetching, onRegisterPress, onLoginPress, isAuthenticated, fetchUser } = useMembership();

  if (isAuthenticated) {
    // Only the very first fetch blocks, refreshes keep the proof mounted
    if (isPending) {
      return (
        <View style={theme.card}>
          <ActivityIndicator accessible accessibilityRole="progressbar" color={theme.colors.neufOrange} />
        </View>
      );
    }

    // Account actions and the privacy policy live behind the header's settings button
    return <Proof fetchUser={fetchUser} isRefetching={isRefetching} />;
  }

  return (
    <>
      <MembershipInfo onRegister={onRegisterPress} onLogin={onLoginPress} />
      <PrivacyButton />
    </>
  );
};
export default Membership;
