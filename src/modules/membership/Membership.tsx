import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import PrivacyButton from 'src/components/PrivacyButton';
import theme from 'src/theme';

import MembershipInfo from './MembershipInfo';
import Proof from './Proof';
import useMembership from './useMembership';

const Membership = () => {
  const {
    isFetchingUserData,
    onRegisterPress,
    onLoginPress,
    onLogoutPress,
    onDeletePress,
    isAuthenticated,
    fetchUser,
  } = useMembership();

  if (isFetchingUserData) {
    return (
      <View style={theme.card}>
        <ActivityIndicator color={theme.colors.neufOrange} />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Proof
          onLogoutPress={onLogoutPress}
          fetchUser={fetchUser}
          isFetchingUserData={isFetchingUserData}
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
