import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { requestRegisterUser } from '../../api';
import { usePrevious } from '../../hooks';

const useUserRegister = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useSelector((store) => store.isAuthenticated);
  const isRegisteringUser = useSelector((store) => store.isRegisteringUser);
  const registerError = useSelector((store) => store.registerError) || {};
  const [toast, setToast] = useState(null);

  const isAuthenticatedPrev = usePrevious(isAuthenticated);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    setError,
  } = useForm();
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
      setError(key, { type: 'manual', message: registerError[key] });
    });
  });

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated, navigation]);

  return { isRegisteringUser, onSubmit, control, isValid, registerError, errors, setFocus, toast, setToast };
};
export default useUserRegister;
