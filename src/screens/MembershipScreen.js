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

    onLoginPress = () => {
        this.props.navigation.navigate('Login');
    };

    logoutNavigate = () => {
        this.props.navigation.navigate('Membership');
    };

    render() {
        return (
            <MembershipContainer onLoginPress={this.onLoginPress} logoutNavigate={this.logoutNavigate} />
        )
    }
}