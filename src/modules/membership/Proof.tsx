import React, { useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import Confetti from 'react-native-confetti';
import RadioForm from 'react-native-simple-radio-button';
import { Button, Incubator } from 'react-native-ui-lib';

import theme from 'src/theme';
import type { UserType } from 'src/types/data';

import useProof from './useProof';
import logo from '../../../assets/DNS-logo-svart.png';

const { Toast } = Incubator;

const MembershipValidTo = ({ user }: { user: UserType }) => {
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

const MembershipStatus = ({
  user,
  onMembershipPress,
}: {
  user: UserType;
  onMembershipPress: (event: GestureResponderEvent) => void | undefined;
}) => {
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

interface PurchaseButtonProps {
  user: UserType;
  paymentLoading: boolean;
  isLoadingMembershipType: boolean;
  membershipPrice: number;
  onPurchasePress: () => void;
  setMembershipTypeSlug: (value: string) => void;
}

const PurchaseButton = ({
  user,
  paymentLoading,
  isLoadingMembershipType,
  onPurchasePress,
  membershipPrice,
  setMembershipTypeSlug,
}: PurchaseButtonProps) => {
  if (user.is_member) {
    return null;
  }

  const options = [
    { label: 'Student', value: 'student' },
    { label: 'Ordinær', value: 'regular' },
    { label: 'Støtte', value: 'support' },
  ];

  const onSelect = (value: string) => {
    setMembershipTypeSlug(value);
  };

  return (
    <View>
      <RadioForm
        radio_props={options}
        initial={1}
        formHorizontal={true}
        labelHorizontal={false}
        buttonColor={theme.colors.neufOrange}
        // @ts-expect-error No overload matches this call. We ignore since we need to style the button
        selectedButtonColor={theme.colors.neufOrange}
        animation={false}
        onPress={onSelect}
        style={styles.radioForm}
      />
      {paymentLoading && <ActivityIndicator color={theme.colors.neufOrange} />}
      <Button
        onPress={onPurchasePress}
        fullWidth
        disabled={paymentLoading || isLoadingMembershipType}
        style={styles.purchaseButton}
      >
        <Text>{`Kjøp medlemskap (${membershipPrice} NOK)`}</Text>
      </Button>
      <View style={styles.purchaseText}>
        <Text style={styles.purchaseTextInner}>Medlemskapet er gyldig i ett år</Text>
      </View>
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserConfetti = ({ user, confettiRef }: { user: UserType; confettiRef: any }) => {
  if (!user.is_member) {
    return null;
  }

  // Confetti!!!!
  return <Confetti ref={confettiRef} confettiCount={Number.MAX_SAFE_INTEGER} />;
};
const Logo = ({ user }: { user: UserType }) => {
  if (!user.is_member) {
    return null;
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
};

const MembershipName = ({ user }: { user: UserType }) => {
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

interface ProofProps {
  onLogoutPress: () => void;
  fetchUser: () => void;
  isFetchingUserData: boolean;
  onDeletePress: () => void;
}
const Proof = ({ onLogoutPress, fetchUser, isFetchingUserData, onDeletePress }: ProofProps) => {
  const CONFETTI_TIMEOUT = 15000;
  const confettiRef = useRef<Confetti>(null);
  const {
    paymentLoading,
    isLoadingMembershipType,
    onPurchasePress,
    membershipPrice,
    toast,
    setToast,
    user,
    setMembershipTypeSlug,
  } = useProof({
    fetchUser,
  });

  useEffect(() => {
    const currentRef = confettiRef.current;
    return () => {
      if (currentRef) {
        currentRef.stopConfetti();
      }
    };
  });

  const onMembershipPress = () => {
    confettiRef.current?.startConfetti();
    setTimeout(() => {
      if (confettiRef && confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    }, CONFETTI_TIMEOUT);
  };

  if (!user) {
    return (
      <View>
        <Text>No user!</Text>
      </View>
    );
  }

  return (
    <>
      <View>
        <UserConfetti user={user} confettiRef={confettiRef} />
        <ScrollView refreshControl={<RefreshControl refreshing={isFetchingUserData} onRefresh={fetchUser} />}>
          <View style={[theme.card, { paddingVertical: 16 }]}>
            <MembershipName user={user} />
            <Logo user={user} />
            <MembershipStatus user={user} onMembershipPress={onMembershipPress} />
            <PurchaseButton
              user={user}
              paymentLoading={paymentLoading}
              isLoadingMembershipType={isLoadingMembershipType}
              membershipPrice={membershipPrice}
              onPurchasePress={onPurchasePress}
              setMembershipTypeSlug={setMembershipTypeSlug}
            />
            <MembershipValidTo user={user} />
          </View>
          <View>
            <Button onPress={onLogoutPress} style={styles.logoutButton} small>
              <Text>Logg ut</Text>
            </Button>
          </View>
          <Button onPress={onDeletePress} style={styles.deleteButton} small>
            <Text style={styles.whiteText}>Slett bruker</Text>
          </Button>
        </ScrollView>
      </View>
      <Toast
        message={toast?.message}
        visible={toast?.visible}
        position="bottom"
        autoDismiss={5 * 1000}
        onDismiss={() => {
          setToast(null);
        }}
      />
    </>
  );
};
export default Proof;

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.success,
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
  },
  validText: {
    color: theme.colors.neufWhite,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
  },
  expired: {
    backgroundColor: theme.colors.danger,
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
    marginVertical: 16,
  },
  expiredText: {
    color: theme.colors.neufWhite,
    textAlign: 'center',
    fontSize: 24,
  },
  notMember: {
    backgroundColor: theme.colors.neufBlue,
    flex: 1,
    marginHorizontal: -16,
    padding: 16,
  },
  notMemberText: {
    color: theme.colors.neufWhite,
    textAlign: 'center',
    fontSize: 24,
  },
  validToValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  purchaseButton: {
    marginTop: 8,
  },
  logoutButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  deleteButton: {
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: theme.colors.danger,
  },
  whiteText: {
    color: theme.colors.neufWhite,
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
  logo: {
    margin: 10,
    resizeMode: 'contain',
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
    alignSelf: 'center',
  },
  radioForm: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    gap: 12,
  },
});
