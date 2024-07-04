import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

import { requestStripePaymentSheet } from '../../api';

const PROOF_QUERY = gql`
  {
    membershipTypes(isDefault: true) {
      slug
      price
    }
  }
`;

function getPrice(membershipTypes) {
  if (!membershipTypes) {
    return 0;
  }

  return membershipTypes[0].price / 100;
}

const useProof = ({ user, fetchUser }) => {
  const userToken = useSelector((state) => state.userToken);
  const chargeError = useSelector((state) => state.chargeError);
  const { data, loading } = useQuery(PROOF_QUERY);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const membershipTypeSlug = data?.membershipTypes?.[0]?.slug ?? 'standard';
  const [toast, setToast] = useState(null);

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
    const { paymentIntent, ephemeralKey, customer } = await requestStripePaymentSheet(userToken, membershipTypeSlug);

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Det Norske Studentersamfund',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        address: {
          country: 'NO',
        },
      },
      returnURL: `${Constants.expoConfig.scheme}://stripe-redirect`,
    });
    if (!error) {
      setPaymentLoading(true);
    }
  };

  /* Refetech user data if memberships has expired */
  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    const lastMembership = user?.last_membership;
    if (lastMembership && lastMembership.membership_type !== 'lifelong' && lastMembership.end_date < todaysDate) {
      fetchUser();
    }
  }, [fetchUser, user?.last_membership]);

  return {
    chargeError: chargeError || '',
    isLoadingMembershipType: loading,
    membershipPrice: getPrice(data?.membershipTypes),
    onChargePress: openPaymentSheet,
    paymentLoading,
    toast,
    setToast,
  };
};

export default useProof;
