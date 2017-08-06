import React, { Component } from 'react';
import LoginContainer from "../modules/login/LoginContainer";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class LoginScreen extends Component {
    static navigationOptions = {
    	title: 'Innlogging',
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