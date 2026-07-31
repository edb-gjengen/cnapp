import * as Notifications from 'expo-notifications';
import React, { useCallback, useRef, useState } from 'react';
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
  Switch,
} from 'react-native';
import { Confetti, PIConfetti } from 'react-native-fast-confetti';
import type { ConfettiMethods, PIConfettiMethods } from 'react-native-fast-confetti';
import { Easing } from 'react-native-reanimated';

import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import Toast from '@/components/Toast';
import { useNotifications } from '@/hooks/useNotifications';
import theme from '@/theme';
import type { UserType } from '@/types/data';

import useProof from './useProof';
import logo from '../../../assets/DNS-logo-svart.png';

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
      <Text style={theme.text}>Gyldig til: </Text>
      <Text style={[theme.text, styles.validToValue]}>{validTo}</Text>
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
        <Text style={[theme.text, styles.expiredText]}>Utløpt</Text>
      </View>
    );
  }

  const statusText = user.is_volunteer ? '❤️ AKTIV ❤️ ' : 'MEDLEM';

  return (
    <View style={styles.membershipStatus}>
      <TouchableOpacity onPress={onMembershipPress} style={styles.valid}>
        <Text style={[theme.text, styles.validText]}>{statusText}</Text>
      </TouchableOpacity>
    </View>
  );
};

interface PurchaseButtonProps {
  user: UserType;
  paymentLoading: boolean;
  isLoadingMembershipType: boolean;
  membershipPrice: number | null;
  membershipTypesError: boolean;
  onPurchasePress: () => void;
  onRetryPress: () => void;
  setMembershipTypeSlug: (value: string) => void;
}

const PurchaseButton = ({
  user,
  paymentLoading,
  isLoadingMembershipType,
  onPurchasePress,
  membershipPrice,
  membershipTypesError,
  onRetryPress,
  setMembershipTypeSlug,
}: PurchaseButtonProps) => {
  const options = [
    { label: 'Student', value: 'student' },
    { label: 'Ordinær', value: 'regular' },
    { label: 'Støtte', value: 'support' },
  ];

  const defaultValue = options[1];

  const onSelect = (value: string) => {
    setMembershipTypeSlug(value);
  };

  if (user.is_member) {
    return null;
  }

  return (
    <View>
      <Text style={[theme.text, styles.selectText]}>Velg medlemskapstype</Text>
      <View style={styles.radioForm}>
        <RadioButton data={options} onSelect={onSelect} defaultValue={defaultValue} />
      </View>
      {paymentLoading && <ActivityIndicator color={theme.colors.neufOrange} />}
      <Button
        onPress={onPurchasePress}
        fullWidth
        disabled={paymentLoading || isLoadingMembershipType || membershipPrice == null}
        style={[theme.button, styles.purchaseButton]}
      >
        <Text style={theme.buttonText}>
          {membershipPrice != null ? `Kjøp medlemskap (${membershipPrice} NOK)` : 'Kjøp medlemskap'}
        </Text>
      </Button>
      {membershipTypesError && (
        <>
          <Text style={[theme.text, styles.errorMessage]}>Kunne ikke hente priser</Text>
          <Button small onPress={onRetryPress} style={[theme.button, styles.retryButton]}>
            <Text style={theme.buttonText}>Prøv igjen</Text>
          </Button>
        </>
      )}
      <View style={styles.purchaseText}>
        <Text style={[theme.text, styles.purchaseTextInner]}>Medlemskapet er gyldig i ett år</Text>
      </View>
    </View>
  );
};

const UserConfetti = ({
  user,
  confettiRef,
  burstRef,
  containerRef,
  onRainStart,
  onRainEnd,
}: {
  user: UserType;
  confettiRef: React.RefObject<ConfettiMethods | null>;
  burstRef: React.RefObject<PIConfettiMethods | null>;
  containerRef: React.RefObject<React.ComponentRef<typeof View> | null>;
  onRainStart: () => void;
  onRainEnd: () => void;
}) => {
  if (!user.is_member) {
    return null;
  }

  // Confetti!!!!
  return (
    <View ref={containerRef} pointerEvents="none" style={styles.confetti}>
      <Confetti
        ref={confettiRef}
        autoplay={false}
        count={400}
        gravity={0.24}
        easing={Easing.linear}
        onAnimationStart={onRainStart}
        onAnimationEnd={onRainEnd}
      />
      <PIConfetti ref={burstRef} autoplay={false} fadeOutOnEnd>
        <PIConfetti.Origin blastPosition="center" count={80} initialSpeed={2} />
      </PIConfetti>
    </View>
  );
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
      <Text style={[theme.text, styles.nameText]}>{name}</Text>
    </View>
  );
};

const NotificationToggle = ({ user }: { user: UserType }) => {
  const { hasPermission, toggleNotifications, scheduleMembershipExpiryNotification } = useNotifications();
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const handleToggle = async (enabled: boolean) => {
    const { success, needsPermission } = await toggleNotifications(enabled);
    if (needsPermission) {
      await Notifications.requestPermissionsAsync();
      setToast({
        message: 'Du må godta varsler i innstillinger for å motta påminnelser',
        visible: true,
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (success && enabled && user.last_membership?.end_date) {
      await scheduleMembershipExpiryNotification(user.last_membership.end_date);
    }
  };

  if (!user.is_member || !user.last_membership) {
    return null;
  }

  return (
    <View style={styles.notificationToggle}>
      <Text style={[theme.text, styles.notificationText]}>Varsle meg når medlemskapet utløper</Text>
      <Switch
        value={hasPermission || false}
        onValueChange={handleToggle}
        trackColor={{ false: '#E0E0E0', true: theme.colors.neufOrange }}
        thumbColor={hasPermission ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#E0E0E0"
        style={styles.switch}
      />
      <Toast
        message={toast?.message}
        visible={toast?.visible || false}
        position="bottom"
        autoDismiss={3000}
        onDismiss={() => setToast(null)}
      />
    </View>
  );
};

interface ProofProps {
  onLogoutPress: () => void;
  fetchUser: () => void;
  isRefetching: boolean;
  onDeletePress: () => void;
}
const Proof = ({ onLogoutPress, fetchUser, isRefetching, onDeletePress }: ProofProps) => {
  const confettiRef = useRef<ConfettiMethods>(null);
  const burstRef = useRef<PIConfettiMethods>(null);
  const confettiContainerRef = useRef<React.ComponentRef<typeof View>>(null);
  const isRaining = useRef(false);
  const {
    paymentLoading,
    isLoadingMembershipType,
    onPurchasePress,
    membershipPrice,
    membershipTypesError,
    refetchMembershipTypes,
    toast,
    setToast,
    user,
    setMembershipTypeSlug,
  } = useProof({
    fetchUser,
  });

  const onRainStart = useCallback(() => {
    isRaining.current = true;
  }, []);
  const onRainEnd = useCallback(() => {
    isRaining.current = false;
  }, []);

  const onMembershipPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    // measure() reports pageX/pageY in the same coordinate space as the touch,
    // which measureInWindow does not on Android.
    confettiContainerRef.current?.measure((x, y, width, height, originX, originY) => {
      burstRef.current?.restart({
        origins: [{ blastPosition: { x: pageX - originX, y: pageY - originY } }],
      });
    });
    if (!isRaining.current) {
      confettiRef.current?.restart();
    }
  };

  if (!user) {
    return (
      <View>
        <Text style={theme.text}>No user!</Text>
      </View>
    );
  }

  return (
    <>
      <UserConfetti
        user={user}
        confettiRef={confettiRef}
        burstRef={burstRef}
        containerRef={confettiContainerRef}
        onRainStart={onRainStart}
        onRainEnd={onRainEnd}
      />
      <View style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={fetchUser} />}>
          <View style={[theme.card, { paddingVertical: 16, backgroundColor: 'transparent' }]}>
            <MembershipName user={user} />
            <Logo user={user} />
            <MembershipStatus user={user} onMembershipPress={onMembershipPress} />
            <PurchaseButton
              user={user}
              paymentLoading={paymentLoading}
              isLoadingMembershipType={isLoadingMembershipType}
              membershipPrice={membershipPrice}
              membershipTypesError={membershipTypesError}
              onPurchasePress={onPurchasePress}
              onRetryPress={() => {
                refetchMembershipTypes().catch(() => {
                  // the failure is surfaced through useQuery's error state
                });
              }}
              setMembershipTypeSlug={setMembershipTypeSlug}
            />
            <MembershipValidTo user={user} />
            <NotificationToggle user={user} />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button onPress={onLogoutPress} style={[theme.button, styles.logoutButton]} small>
            <Text style={theme.buttonText}>Logg ut</Text>
          </Button>
          <Button onPress={onDeletePress} style={[theme.button, styles.deleteButton]} small>
            <Text style={styles.whiteText}>Slett bruker</Text>
          </Button>
        </View>
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
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
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
  retryButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  logoutButton: {
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  whiteText: {
    color: theme.colors.neufWhite,
    fontWeight: '500',
  },
  purchaseText: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 4,
    marginBottom: 20,
  },
  selectText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  notificationText: {
    fontSize: 18,
  },
  switch: {
    transform: [{ scale: 1.25 }],
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
});
