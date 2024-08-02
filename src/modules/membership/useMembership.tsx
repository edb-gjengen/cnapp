import { useNavigation } from '@react-navigation/native';
import { useEffect, useCallback } from 'react';

import { logout } from 'src/actions';
import { requestUserData } from 'src/api';
import { useAppDispatch, useAppSelector, usePrevious } from 'src/hooks';

const useMembership = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((store) => store.isAuthenticated);
  const isFetchingUserData = useAppSelector((store) => store.isFetchingUserData);
  const userToken = useAppSelector((store) => store.userToken);
  const prevUserToken = usePrevious(userToken);

  const onLogoutPress = () => {
    dispatch(logout());
    navigation.navigate('UserStack', { screen: 'Membership' });
  };
  const onRegisterPress = () => navigation.navigate('UserStack', { screen: 'UserRegister' });
  const onLoginPress = () => navigation.navigate('UserStack', { screen: 'Login' });
  const onDeletePress = () => navigation.navigate('UserStack', { screen: 'UserDelete' });
  const fetchUser = useCallback(() => {
    dispatch(requestUserData(userToken || ''));
  }, [dispatch, userToken]);

  useEffect(() => {
    if (userToken !== prevUserToken && userToken) {
      fetchUser();
    }
  }, [userToken, prevUserToken, fetchUser]);

  return {
    isAuthenticated,
    isFetchingUserData,
    userToken,
    onLogoutPress,
    onRegisterPress,
    onDeletePress,
    onLoginPress,
    fetchUser,
  };
};
export default useMembership;
