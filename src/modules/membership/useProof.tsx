import { gql, useQuery } from '@apollo/client';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import { useNotifications } from '@/hooks/useNotifications';
import { usePaymentSheetMutation } from '@/queries/usePaymentSheetMutation';
import { useUser } from '@/queries/useUser';
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
  const { user } = useUser();
  const { data, loading, error, refetch } = useQuery(PROOF_QUERY);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { mutateAsync: createPaymentSheet } = usePaymentSheetMutation();
  const { scheduleMembershipExpiryNotification, hasPermission } = useNotifications();
  const [paymentLoading, setPaymentLoading] = useState(false);
  // Matches the preselected option in PurchaseButton's radio list
  const [membershipTypeSlug, setMembershipTypeSlug] = useState('regular');
  const [toast, setToast] = useState<ToastProps | null>(null);

  // null until the query has delivered a price for the selected type; the
  // purchase button stays disabled rather than showing a guessed amount
  const membershipPrice =
    data?.membershipTypes?.find(
      (membershipTypeOption: { slug: string; price: number }) => membershipTypeOption.slug === membershipTypeSlug,
    )?.price ?? null;

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
    const { paymentIntent, ephemeralKey, customer } = await createPaymentSheet(membershipTypeSlug);

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
    membershipPrice: membershipPrice != null ? membershipPrice / 100 : null,
    membershipTypesError: !!error,
    refetchMembershipTypes: refetch,
    onPurchasePress: openPaymentSheet,
    paymentLoading,
    toast,
    setToast,
    user,
    setMembershipTypeSlug,
  };
};

export default useProof;
