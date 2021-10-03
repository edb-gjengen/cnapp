import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';

import theme from '../../theme';
import useMembership from './useMembership';
import MembershipInfo from './MembershipInfo';
import Proof from './Proof';

const Membership = () => {
  const { isFetchingUserData, onRegisterPress, onLoginPress, onLogoutPress, user, isAuthenticated, fetchUser } =
    useMembership();

  if (isFetchingUserData) {
    return (
      <View style={styles.card}>
        <Spinner color="#f58220" />
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
    color: '#000',
    paddingBottom: 10,
    lineHeight: 25,
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
  },
  em: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
    paddingVertical: 10,
    lineHeight: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 25,
    paddingLeft: 2,
  },
});
