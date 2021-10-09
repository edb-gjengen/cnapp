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
  const { isAuthenticated, isRegisteringUser, registerError } = useSelector((store) => ({
    isAuthenticated: store.isAuthenticated,
    isRegisteringUser: store.isRegisteringUser,
    registerError: store.registerError === null ? {} : store.registerError,
  }));

  const isAuthenticatedPrev = usePrevious(isAuthenticated);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
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
  });

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated]);

  return { onSubmit, isRegisteringUser, registerError, control, setFocus, errors };
};
export default useUserRegister;
