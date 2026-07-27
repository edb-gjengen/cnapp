import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { requestRegisterUser } from '@/api';
import { useAppDispatch, useAppSelector, usePrevious } from '@/hooks';
import { ToastProps } from '@/types/toast';

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
  const registerError = useAppSelector((store) => store.registerError);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const isAuthenticatedPrev = usePrevious(isAuthenticated);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
    setFocus,
    setError,
    clearErrors,
  } = useForm<UserRegisterFormValues>();
  const onSubmit = handleSubmit((values) => {
    clearErrors();
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
    if (!registerError) return;
    Object.keys(registerError).forEach((key) => {
      const errorMessages = registerError[key];
      if (!errorMessages || !Array.isArray(errorMessages)) {
        return;
      }
      setError(key as keyof UserRegisterFormValues, { type: 'server', message: errorMessages.join('\n') });
    });
  });

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated, navigation]);

  useEffect(() => {
    clearErrors();
    if (!isSubmitted || !registerError) return;
    Object.keys(registerError).forEach((key) => {
      const errorMessages = registerError[key];
      if (!errorMessages || !Array.isArray(errorMessages)) {
        return;
      }
      setError(key as keyof UserRegisterFormValues, { type: 'server', message: errorMessages.join('\n') });
    });
  }, [registerError, isSubmitted, clearErrors, setError]);

  return {
    isRegisteringUser,
    onSubmit,
    isValid,
    isSubmitted,
    registerError,
    control,
    errors,
    setFocus,
    toast,
    setToast,
  };
};
export default useUserRegister;
