import React, { Component } from 'react';
import MembershipContainer from "../modules/membership/MembershipContainer";

export default class MembershipScreen extends Component {
    static navigationOptions = {
        title: 'Medlemskap',
    };

    render() {
        return (
            <MembershipContainer />
        )
    }
}