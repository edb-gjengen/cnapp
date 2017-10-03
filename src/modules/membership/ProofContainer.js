import React, {Component} from 'react';
import {connect} from "react-redux";
import stripe from 'tipsi-stripe'
import Config from 'react-native-config';

import Proof from "./Proof";
import {requestMembershipCharge} from "../../api";


stripe.init({
    publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
});

class ProofContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.user !== nextProps.user) {
            this.setState({user: nextProps.user})
        }
    }

    render() {
        return <Proof {...this.state} user={this.props.user} onChargePress={this.openStripe} />
    }

    openStripe = () => {
        const options = {
            prefilledInformation: {
                email: this.props.user.email,
            },
            smsAutofillDisabled: true,
        };

        stripe.paymentRequestWithCardForm(options).then(
            (token) => {
                // returns a token.tokenId which should be saved
                this.props.requestMembershipCharge(
                    this.props.userToken,
                    {id: token.tokenId, email: this.props.user.email},
                    'standard');
            },
            (error) => {
                // TODO: display error
                console.log(error);
            }
        );
    };

    // fetchUser = () => {
    //     this.props.fetchUser().then(() => {
    //         this.setState({refreshing: false});
    //     });
    // };

    // _onRefresh() {
    //     console.log('onRefresh')
    //     this.setState({refreshing: true});
    //     this.fetchUser()
    // }

    // refreshControl() {
    //     return (
    //         <RefreshControl
    //             refreshing={this.state.refreshing}
    //             onRefresh={this._onRefresh.bind(this)}
    //         />)
    // }
}

export default connect(
    (state) => ({
        userToken: state.userToken
    }),
    {requestMembershipCharge}
)(ProofContainer);
