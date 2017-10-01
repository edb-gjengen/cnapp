import React, { Component } from 'react';
import MembershipContainer from "../modules/membership/MembershipContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';
import UserRegisterContainer from "../modules/membership/UserRegisterContainer";

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

    onLoginPress = () => {
        this.props.navigation.navigate('Login');
    };

    logoutNavigate = () => {
        this.props.navigation.navigate('Membership');
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <UserRegisterContainer/>
                {/*<MembershipContainer onLoginPress={this.onLoginPress} logoutNavigate={this.logoutNavigate} />*/}
            </StyleProvider>
        )
    }
}