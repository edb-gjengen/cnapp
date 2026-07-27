import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { requestLogin } from '@/api';
import { useAppDispatch, useAppSelector } from '@/hooks';

interface LoginFormValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((store) => store.isAuthenticated);
  const isLoggingIn = useAppSelector((store) => store.isLoggingIn);
  const loginError = useAppSelector((store) => store.loginError);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setFocus,
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit(({ email, password }) => {
    dispatch(requestLogin(email, password));
  });

  useEffect(() => {
    if (isAuthenticated) {
      // navigation.goBack onLogin works since LoginScreen is allways navigated to from MembershipScreen
      navigation.goBack();
    }
  }, [isAuthenticated, navigation]);

  return { onSubmit, isLoggingIn, isSubmitted, setFocus, control, errors: { ...errors }, loginError };
};

export default useLogin;
