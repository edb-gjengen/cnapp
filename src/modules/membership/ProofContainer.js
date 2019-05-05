import React, { Component } from 'react';
import { connect } from 'react-redux';
import stripe from 'tipsi-stripe';
import Config from 'react-native-config';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Proof from './Proof';
import { requestMembershipCharge } from '../../api';

stripe.setOptions({
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY || '',
});

class ProofContainer extends Component {
  getPrice(membershipTypes) {
    if (!membershipTypes) {
      return 0;
    }

    return membershipTypes[0].price / 100;
  }

  componentDidMount = () => {
    this.checkExpiry();
  };

  render() {
    return (
      <Proof
        user={this.props.user}
        fetchUser={this.props.fetchUser}
        isFetchingUserData={this.props.isFetchingUserData}
        isChargingMembership={this.props.isChargingMembership}
        isLoadingMembershipType={this.props.data.loading}
        chargeError={this.props.chargeError ? this.props.chargeError : ''}
        onChargePress={this.openStripe}
        onLogoutPress={this.props.onLogoutPress}
        membershipPrice={this.getPrice(this.props.data.membershipTypes)}
      />
    );
  }

  checkExpiry() {
    const { user, fetchUser } = this.props;
    const todaysDate = new Date().toISOString().substring(0, 10);
    const lastMembership = user.last_membership;
    if (lastMembership && lastMembership.membership_type !== 'lifelong' && lastMembership.end_date > todaysDate) {
      fetchUser();
    }
  }

  openStripe = () => {
    const options = {
      prefilledInformation: {
        email: this.props.user.email,
      },
      smsAutofillDisabled: true,
    };

    const membershipTypeSlug = this.props.data.membershipTypes ? this.props.data.membershipTypes[0].slug : 'standard';

    stripe.paymentRequestWithCardForm(options).then(
      (token) => {
        // returns a token.tokenId which should be saved
        this.props.requestMembershipCharge(
          this.props.userToken,
          { id: token.tokenId, email: this.props.user.email },
          membershipTypeSlug
        );
      },
      () => {
        /* FIXME: Happens only if card dialog is canceled? */
      }
    );
  };
}

const PROOF_QUERY = gql`
  {
    membershipTypes(isDefault: true) {
      slug
      price
    }
  }
`;

const proofContainerWithState = connect(
  (store) => ({
    userToken: store.userToken,
    isChargingMembership: store.isChargingMembership,
    chargeError: store.chargeError,
  }),
  { requestMembershipCharge }
)(ProofContainer);

export default graphql(PROOF_QUERY)(proofContainerWithState);
