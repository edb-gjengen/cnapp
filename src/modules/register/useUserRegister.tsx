import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { requestRegisterUser } from 'src/api';
import { useAppDispatch, useAppSelector, usePrevious } from 'src/hooks';
import { ToastProps } from 'src/types/toast';

export interface UserRegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

const useUserRegister = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useAppSelector((store) => store.isAuthenticated);
  const isRegisteringUser = useAppSelector((store) => store.isRegisteringUser);
  const registerError = useAppSelector((store) => store.registerError) || {};
  const [toast, setToast] = useState<ToastProps | null>(null);

  const isAuthenticatedPrev = usePrevious(isAuthenticated);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    setError,
  } = useForm<UserRegisterFormValues>();
  const onSubmit = handleSubmit((values) => {
    if (!isValid) {
      setToast({
        message: 'Noen av feltene er ikke fylt ut riktig',
        visible: true,
        preset: 'failure',
      });
      return;
    }
    setToast(null);

    dispatch(requestRegisterUser(values));

    // Display error messages from API on form fields
    Object.keys(registerError).forEach((key) => {
      setError(key as keyof UserRegisterFormValues, { type: 'manual', message: registerError[key] });
    });
  });

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated, navigation]);

  return { isRegisteringUser, onSubmit, isValid, registerError, control, errors, setFocus, toast, setToast };
};
export default useUserRegister;
