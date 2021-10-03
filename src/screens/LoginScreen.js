import React from 'react';

import Login from '../modules/login/Login';

// navigation.goBack onLogin works since LoginScreen is allways navigated to from MembershipScreen
const LoginScreen = () => {
  return <Login />;
};
LoginScreen.navigationOptions = {
  title: 'Logg inn',
};
export default LoginScreen;
