import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import PrivacyButton from '@/components/PrivacyButton';
import theme from '@/theme';

import MembershipInfo from './MembershipInfo';
import Proof from './Proof';
import useMembership from './useMembership';

const Membership = () => {
  const {
    isPending,
    isRefetching,
    onRegisterPress,
    onLoginPress,
    onLogoutPress,
    onDeletePress,
    isAuthenticated,
    fetchUser,
  } = useMembership();

  if (isAuthenticated) {
    // Only the very first fetch blocks, refreshes keep the proof mounted
    if (isPending) {
      return (
        <View style={theme.card}>
          <ActivityIndicator color={theme.colors.neufOrange} />
        </View>
      );
    }

    return (
      <>
        <Proof
          onLogoutPress={onLogoutPress}
          fetchUser={fetchUser}
          isRefetching={isRefetching}
          onDeletePress={onDeletePress}
        />
        <PrivacyButton />
      </>
    );
  }

  return (
    <>
      <MembershipInfo onRegister={onRegisterPress} onLogin={onLoginPress} />
      <PrivacyButton />
    </>
  );
};
export default Membership;
