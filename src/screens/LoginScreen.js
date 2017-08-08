import React, { Component } from 'react';
import LoginContainer from "../modules/login/LoginContainer";

export default class LoginScreen extends Component {
    static navigationOptions = {
        title: 'Logg inn',
    };

    onLogin = () => {
        this.props.navigation.navigate('Membership');
    };

    render() {
        return (
            <LoginContainer onLogin={this.onLogin} />
        )
    }
}