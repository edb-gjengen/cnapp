import { useNavigation } from '@react-navigation/native';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../actions';
import { requestUserData } from '../../api';
import { usePrevious } from '../../hooks';

const useMembership = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store) => store.isAuthenticated);
  const isFetchingUserData = useSelector((store) => store.isFetchingUserData);
  const lastOrder = useSelector((store) => store.lastOrder);
  const user = useSelector((store) => store.user);
  const userToken = useSelector((store) => store.userToken);
  const prevUserToken = usePrevious(userToken);
  const prevLastOrder = usePrevious(lastOrder);

  const onLogoutPress = () => {
    dispatch(logout());
    navigation.navigate('Membership');
  };
  const onRegisterPress = () => navigation.navigate('UserRegister');
  const onLoginPress = () => navigation.navigate('Login');
  const fetchUser = useCallback(() => {
    dispatch(requestUserData(userToken));
  }, [dispatch, userToken]);

  useEffect(() => {
    if (userToken !== prevUserToken && userToken) {
      fetchUser();
    }
    if (prevLastOrder !== lastOrder && userToken) {
      fetchUser();
    }
  }, [userToken, prevUserToken, lastOrder, prevLastOrder, fetchUser]);

  return {
    isAuthenticated,
    isFetchingUserData,
    userToken,
    user,
    lastOrder,
    onLogoutPress,
    onRegisterPress,
    onLoginPress,
    fetchUser,
  };
};
export default useMembership;
