import React, { Component } from 'react';
import { StyleProvider } from 'native-base';
import LoginContainer from '../modules/login/LoginContainer';
import getTheme from '../../native-base-theme/components';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Logg inn',
    headerStyle: {
      backgroundColor: '#f58220',
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
  };

  onLogin = () => {
    // This works since LoginScreen is allways navigated to from MembershipScreen
    this.props.navigation.goBack();
  };

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <LoginContainer onLogin={this.onLogin} />
      </StyleProvider>
    );
  }
}
