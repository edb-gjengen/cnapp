import React, { Component } from 'react';
import MembershipContainer from "../modules/membership/MembershipContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';

export default class MembershipScreen extends Component {
    static navigationOptions = {
        title: 'Medlemskap',
        headerStyle: {
            backgroundColor: '#f58220',
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="user" size={16} color={tintColor} style={{marginTop: 5}} />
        ),
    };

    loginNavigate = () => {
        this.props.navigation.navigate('Login');
    };

    logoutNavigate = () => {
        this.props.navigation.navigate('Membership');
    };

    registerNavigate = () => {
        this.props.navigation.navigate('UserRegister');
    };

    chargeNavigate = () => {
        this.props.navigation.navigate('Charge');
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <MembershipContainer
                    onLoginPress={this.loginNavigate}
                    onLogoutPress={this.logoutNavigate}
                    onRegisterPress={this.registerNavigate}
                    onChargePress={this.chargeNavigate} />
            </StyleProvider>
        )
    }
}