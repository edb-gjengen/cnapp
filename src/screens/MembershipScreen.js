import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { StyleProvider } from 'native-base';
import MembershipContainer from '../modules/membership/MembershipContainer';
import getTheme from '../../native-base-theme/components';

export default class MembershipScreen extends Component {
  static navigationOptions = {
    title: 'Medlemskap',
    tabBarIcon: ({ tintColor }) => <Icon name="user" size={16} color={tintColor} style={{ marginTop: 5 }} />,
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

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <MembershipContainer
          onLoginPress={this.loginNavigate}
          onLogoutPress={this.logoutNavigate}
          onRegisterPress={this.registerNavigate}
        />
      </StyleProvider>
    );
  }
}
