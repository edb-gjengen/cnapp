import { gql, useQuery } from '@apollo/client';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import { requestStripePaymentSheet } from 'src/api';
import { useAppSelector } from 'src/hooks';
import { ToastProps } from 'src/types/toast';

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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [membershipTypeSlug, setMembershipTypeSlug] = useState('standard');
  const [membershipPrice, setMembershipPrice] = useState(25000); // WARNING: Hardcoded due to state not being loaded initially. Should probably be fixed.
  const [toast, setToast] = useState<ToastProps | null>(null);

  const openPaymentSheet = async () => {
    try {
      await initializePaymentSheet();
    } catch (err) {
      console.error('🔥', err);
      setToast({ message: 'Oops! Could not initialise payment', visible: true, preset: 'failure' });
    }
    const { error } = await presentPaymentSheet();
    const message = error ? `Error code: ${error.code} ${error.message}` : 'Your order is confirmed!';
    setToast({ message, visible: true, preset: error ? 'failure' : 'success' });
    setPaymentLoading(false);
  };

  const initializePaymentSheet = async () => {
    setPaymentLoading(true);
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
    if (!error) {
      setPaymentLoading(true);
    }
  };

  /* Refetech user data if memberships has expired */
  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    if (
      user?.lastMembership &&
      user.lastMembership.membership_type !== 'lifelong' &&
      user.lastMembership.end_date < todaysDate
    ) {
      fetchUser();
    }
  }, [user?.last_membership]);

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const membershipType of data?.membershipTypes ?? []) {
      if (membershipType.slug === membershipTypeSlug) {
        setMembershipPrice(membershipType.price);
      }
    }
  }, [membershipTypeSlug, data?.membershipTypes]);

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
