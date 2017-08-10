import React, { Component } from 'react';
import LoginContainer from "../modules/login/LoginContainer";

export default class LoginScreen extends Component {
    static navigationOptions = {
        title: 'Logg inn',
    };

    onLogin = () => {
        // This works since LoginScreen is allways navigated to from MembershipScreen
        this.props.navigation.goBack();
    };

    render() {
        return (
            <LoginContainer onLogin={this.onLogin} />
        )
    }
}