import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import stripe from 'tipsi-stripe';
import Config from 'react-native-config';
import { gql, useQuery } from '@apollo/client';

import { requestMembershipCharge } from '../../api';

// TODO: switch to official stripe client
// stripe.setOptions({
//   publishableKey: Config.STRIPE_PUBLISHABLE_KEY || '',
// });

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
  const dispatch = useDispatch();
  const { userToken, isChargingMembership, chargeError } = useSelector((state) => ({
    userToken: state.userToken,
    isChargingMembership: state.isChargingMembership,
    chargeError: state.chargeError,
  }));
  const { data, loading } = useQuery(PROOF_QUERY);

  const openStripe = () => {
    const options = {
      prefilledInformation: {
        email: user.email,
      },
      smsAutofillDisabled: true,
    };

    const membershipTypeSlug = data?.membershipTypes?.[0]?.slug ?? 'standard';

    // stripe.paymentRequestWithCardForm(options).then(
    //   (token) => {
    //     // returns a token.tokenId which should be saved
    //     dispatch(requestMembershipCharge(userToken, { id: token.tokenId, email: user.email }, membershipTypeSlug));
    //   },
    //   () => {
    //     /* FIXME: Happens only if card dialog is canceled? */
    //   }
    // );
  };

  useEffect(() => {
    const todaysDate = new Date().toISOString().substring(0, 10);
    const lastMembership = user?.last_membership;
    if (lastMembership && lastMembership.membership_type !== 'lifelong' && lastMembership.end_date < todaysDate) {
      fetchUser();
    }
  }, []);

  return {
    chargeError: chargeError || '',
    isChargingMembership,
    isLoadingMembershipType: loading,
    membershipPrice: getPrice(data?.membershipTypes),
    onChargePress: openStripe,
  };
};

export default useProof;
