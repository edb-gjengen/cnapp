import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { requestLogin } from '../../api';

const useLogin = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((store) => store.isAuthenticated);
  const isLoggingIn = useSelector((store) => store.isLoggingIn);
  const loginError = useSelector((store) => store.loginError);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  const onSubmit = handleSubmit(({ email, password }) => {
    dispatch(requestLogin(email, password));
  });

  useEffect(() => {
    if (isAuthenticated) {
      // navigation.goBack onLogin works since LoginScreen is allways navigated to from MembershipScreen
      navigation.goBack();
    }
  }, [isAuthenticated, navigation]);

  return { onSubmit, isLoggingIn, control, setFocus, errors: { ...errors, ...loginError } };
};

export default useLogin;
