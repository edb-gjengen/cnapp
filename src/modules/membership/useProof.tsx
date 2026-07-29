import { gql, useQuery } from '@apollo/client';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import { requestStripePaymentSheet } from '@/api';
import { useAppSelector } from '@/hooks';
import { useNotifications } from '@/hooks/useNotifications';
import { ToastProps } from '@/types/toast';

const PROOF_QUERY = gql`
  {
    membershipTypes {
      slug
      price
    }
  }
`;

interface UseProofProps {
  fetchUser: () => void;
}

const useProof = ({ fetchUser }: UseProofProps) => {
  const user = useAppSelector((state) => state.user);
  const userToken = useAppSelector((state) => state.userToken);
  const { data, loading } = useQuery(PROOF_QUERY);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { scheduleMembershipExpiryNotification, hasPermission } = useNotifications();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [membershipTypeSlug, setMembershipTypeSlug] = useState('standard');
  const [toast, setToast] = useState<ToastProps | null>(null);

  // WARNING: Hardcoded fallback price for when the query hasn't loaded yet. Should probably be fixed.
  const membershipPrice =
    data?.membershipTypes?.find(
      (membershipTypeOption: { slug: string; price: number }) => membershipTypeOption.slug === membershipTypeSlug,
    )?.price ?? 25000;

  const openPaymentSheet = async () => {
    setPaymentLoading(true);
    try {
      await initializePaymentSheet();
    } catch (err) {
      console.error('🔥', err);
      setToast({ message: 'Oops! Could not initialise payment', visible: true, preset: 'failure' });
      setPaymentLoading(false);
      return;
    }
    const { error } = await presentPaymentSheet();
    const message = error ? `Error code: ${error.code} ${error.message}` : 'Your order is confirmed!';
    setToast({ message, visible: true, preset: error ? 'failure' : 'success' });
    setPaymentLoading(false);
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await requestStripePaymentSheet(
      userToken as string,
      membershipTypeSlug,
    );

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Det Norske Studentersamfund',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        email: user?.email,
        name: `${user?.first_name} ${user?.last_name}`,
        address: {
          country: 'NO',
        },
      },
      returnURL: `${Constants.expoConfig?.scheme}://stripe-redirect`,
    });
    if (error) {
      throw error;
    }
  };

  /* Refetch user data if membership has expired */
  const membershipType = user?.last_membership?.membership_type;
  const membershipEndDate = user?.last_membership?.end_date;
  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    if (membershipEndDate && membershipType !== 'lifelong' && membershipEndDate < todaysDate) {
      fetchUser();
      // If payment was successful and notifications are enabled, schedule the notification
      if (hasPermission) {
        scheduleMembershipExpiryNotification(membershipEndDate);
      }
    }
  }, [membershipType, membershipEndDate, fetchUser, hasPermission, scheduleMembershipExpiryNotification]);

  return {
    isLoadingMembershipType: loading,
    membershipPrice: membershipPrice ? membershipPrice / 100 : 0,
    onPurchasePress: openPaymentSheet,
    paymentLoading,
    toast,
    setToast,
    user,
    setMembershipTypeSlug,
  };
};

export default useProof;
