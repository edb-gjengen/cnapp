import React from 'react';
import { StyleProvider } from 'native-base';
import { useNavigation } from 'react-navigation-hooks';
import LoginContainer from '../modules/login/LoginContainer';
import getTheme from '../../native-base-theme/components';

// navigation.goBack onLogin works since LoginScreen is allways navigated to from MembershipScreen
const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <StyleProvider style={getTheme()}>
      <LoginContainer onLogin={navigation.goBack} />
    </StyleProvider>
  );
};
LoginScreen.navigationOptions = {
  title: 'Logg inn',
};
export default LoginScreen;
