import React, { Component } from 'react';
import UserRegisterContainer from "../modules/register/UserRegisterContainer";
import {StyleProvider} from "native-base";
import getTheme from '../../native-base-theme/components';

export default class UserRegisterScreen extends Component {
    static navigationOptions = {
        title: 'Bli medlem',
        headerStyle: {
            backgroundColor: '#f58220',
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    };

    onRegister = () => {
        // This works since UserRegisterScreen is allways navigated to from MembershipScreen
        this.props.navigation.goBack();
    };

    render() {
        return (
            <StyleProvider style={getTheme()}>
                <UserRegisterContainer onRegister={this.onRegister} />
            </StyleProvider>
        )
    }
}