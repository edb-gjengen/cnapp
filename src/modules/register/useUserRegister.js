import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
  const onRegisterPress = () => (firstName, lastName, email, phoneNumber, password) =>
    dispatch(requestRegisterUser(firstName, lastName, email, phoneNumber, password));

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticatedPrev, isAuthenticated]);

  return { onRegisterPress, isRegisteringUser, registerError };
};
export default useUserRegister;
