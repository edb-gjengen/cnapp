import React, { Component } from 'react';
import MembershipContainer from "../modules/membership/MembershipContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class MembershipScreen extends Component {
    static navigationOptions = {
        title: 'Medlemskap',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="user" size={18} color={tintColor} style={{marginTop: 5}} />
        ),
    };

    render() {
        return (
            <MembershipContainer />
        )
    }
}