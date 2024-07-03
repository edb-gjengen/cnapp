import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'native-base';
import { useForm } from 'react-hook-form';

import { usePrevious } from '../../hooks';
import { requestRegisterUser } from '../../api';

const useUserRegister = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useSelector((store) => store.isAuthenticated);
  const isRegisteringUser = useSelector((store) => store.isRegisteringUser);
  const registerError = useSelector((store) => (store.registerError === null ? {} : store.registerError));

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
      Toast.show({
        text: 'Noen av feltene er ikke fylt ut riktig',
        position: 'bottom',
        buttonText: 'OK',
        duration: 1500,
      });
      return;
    }

    dispatch(requestRegisterUser(values));

    // Display error messages from API on form fields
    for (const key in registerError) {
      setError(key, { type: 'manual', message: registerError[key] });
    }
  });

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated, navigation]);

  return { isRegisteringUser, onSubmit, control, isValid, registerError, errors, setFocus };
};
export default useUserRegister;
