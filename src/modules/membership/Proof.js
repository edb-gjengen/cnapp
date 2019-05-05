import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Button, Text as NBText, Spinner } from 'native-base';
import Confetti from 'react-native-confetti';

import theme from '../../theme';

const MembershipValidTo = ({ user }) => {
  if (!user.last_membership) {
    return null;
  }

  let validTo = user.last_membership.end_date;
  if (user.last_membership.membership_type === 'lifelong') {
    validTo = 'Livsvarig';
  }

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text>Gyldig til: </Text>
      <Text style={styles.validToValue}>{validTo}</Text>
    </View>
  );
};

const MembershipStatus = ({ user, onMembershipPress }) => {
  if (!user.is_member) {
    if (!user.last_membership) {
      return null;
    }

    return (
      <View style={styles.expired}>
        <Text style={styles.expiredText}>Utløpt</Text>
      </View>
    );
  }

  const statusText = user.is_volunteer ? '❤️ AKTIV ❤️ ' : 'MEDLEM';

  return (
    <View style={styles.membershipStatus}>
      <TouchableOpacity onPress={onMembershipPress} style={styles.valid}>
        <Text style={styles.validText}>{statusText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const PurchaseButton = ({ user, isChargingMembership, isLoadingMembershipType, onChargePress, membershipPrice }) => {
  if (user.is_member) {
    return null;
  }

  return (
    <View>
      {isChargingMembership && <Spinner color="#f58220" />}
      <Button
        onPress={onChargePress}
        full
        disabled={isChargingMembership || isLoadingMembershipType}
        style={styles.purchaseButton}
      >
        <NBText>{`Kjøp medlemskap (${membershipPrice} NOK)`}</NBText>
      </Button>
      <View style={styles.purchaseText}>
        <Text style={styles.purchaseTextInner}>Medlemskapet er gyldig i ett år</Text>
      </View>
    </View>
  );
};

const UserConfetti = ({ user, confettiRef }) => {
  if (!user.is_member) {
    return null;
  }

  // Confetti!!!!
  return <Confetti ref={confettiRef} confettiCount={Number.MAX_SAFE_INTEGER} />;
};
const Logo = ({ user }) => {
  if (!user.is_member) {
    return null;
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Image
        style={{ width: null, height: 100 }}
        source={{ uri: 'https://galtinn.neuf.no/static/dist/images/logo.png' }}
        resizeMode="contain"
      />
    </View>
  );
};

const ChargeError = ({ chargeError }) => {
  if (!chargeError) {
    return null;
  }

  return (
    <View>
      <Text style={styles.errorMessage}>{chargeError}</Text>
    </View>
  );
};

const MembershipName = ({ user }) => {
  let name = `${user.first_name} ${user.last_name}`;
  if (name === ' ') {
    name = user.email;
  }
  return (
    <View>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
};

const Proof = ({
  chargeError,
  user,
  fetchUser,
  isFetchingUserData,
  isChargingMembership,
  isLoadingMembershipType,
  membershipPrice,
  onChargePress,
  onLogoutPress,
}) => {
  const CONFETTI_TIMEOUT = 15000;
  const confettiRef = useRef(null);

  useEffect(() => {
    return () => {
      if (confettiRef && confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    };
  });

  const onMembershipPress = () => {
    confettiRef.current.startConfetti();
    setTimeout(() => {
      if (confettiRef && confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    }, CONFETTI_TIMEOUT);
  };

  return (
    <View>
      <UserConfetti user={user} confettiRef={confettiRef} />
      <ScrollView refreshControl={<RefreshControl refreshing={isFetchingUserData} onRefresh={fetchUser} />}>
        <View style={[styles.card, { paddingVertical: 16 }]}>
          <MembershipName user={user} />
          <Logo user={user} />
          <MembershipStatus user={user} onMembershipPress={onMembershipPress} />
          <ChargeError chargeError={chargeError} />
          <PurchaseButton
            user={user}
            isChargingMembership={isChargingMembership}
            isLoadingMembershipType={isLoadingMembershipType}
            membershipPrice={membershipPrice}
            onChargePress={onChargePress}
          />
          <MembershipValidTo user={user} />
        </View>
        <View>
          <Button onPress={onLogoutPress} style={styles.logoutButton} small>
            <NBText>Logg ut</NBText>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
export default Proof;

const styles = StyleSheet.create({
  card: theme.card,
  membershipStatus: {
    marginVertical: 16,
  },
  nameText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  valid: {
    backgroundColor: '#5cb85c',
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
  },
  validText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
  },
  expired: {
    backgroundColor: '#d9534f',
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
    marginVertical: 16,
  },
  expiredText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
  },
  notMember: {
    backgroundColor: '#62B1F6',
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
  },
  notMemberText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
  },
  validToValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  purchaseButton: {
    marginTop: 16,
  },
  logoutButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  purchaseText: {
    alignItems: 'center',
  },
  purchaseTextInner: {
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  errorMessage: {
    paddingTop: 10,
    textAlign: 'center',
    color: theme.colors.danger,
  },
});
