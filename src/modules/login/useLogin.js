import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../../api';

const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const onLoginPress = () => {
    dispatch(requestLogin(email, password));
  };

  const { isAuthenticated, isLoggingIn, loginError } = useSelector((store) => ({
    isAuthenticated: store.isAuthenticated,
    isLoggingIn: store.isLoggingIn,
    loginError: store.loginError,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      // navigation.goBack onLogin works since LoginScreen is allways navigated to from MembershipScreen
      navigation.goBack();
    }
  }, [isAuthenticated]);

  return { email, setEmail, password, setPassword, onLoginPress, isLoggingIn, loginError };
};

export default useLogin;
