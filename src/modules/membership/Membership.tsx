import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import theme from 'src/theme';

import MembershipInfo from './MembershipInfo';
import Proof from './Proof';
import useMembership from './useMembership';

const Membership = () => {
  const { isFetchingUserData, onRegisterPress, onLoginPress, onLogoutPress, user, isAuthenticated, fetchUser } =
    useMembership();

  if (isFetchingUserData) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={theme.colors.neufOrange} />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <Proof onLogoutPress={onLogoutPress} user={user} fetchUser={fetchUser} isFetchingUserData={isFetchingUserData} />
    );
  }

  return <MembershipInfo onRegister={onRegisterPress} onLogin={onLoginPress} />;
};
export default Membership;

const styles = StyleSheet.create({
  card: theme.card,
  paragraph: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.neufBlack,
    paddingBottom: 10,
    lineHeight: 25,
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
  },
  em: {
    fontSize: 16,
    color: theme.colors.neufBlack,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.colors.neufBlack,
    paddingVertical: 10,
    lineHeight: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.neufBlack,
    lineHeight: 25,
    paddingLeft: 2,
  },
});
