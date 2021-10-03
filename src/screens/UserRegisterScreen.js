import React, { Component } from 'react';
import UserRegisterContainer from '../modules/register/UserRegisterContainer';

export default class UserRegisterScreen extends Component {
  onRegister = () => {
    // This works since UserRegisterScreen is allways navigated to from MembershipScreen
    this.props.navigation.goBack();
  };

  render() {
    return <UserRegisterContainer onRegister={this.onRegister} />;
  }
}
