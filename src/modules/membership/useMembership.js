import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../actions';
import { requestUserData } from '../../api';
import { usePrevious } from '../../hooks';

const useMembership = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuthenticated, isFetchingUserData, userToken, user, lastOrder } = useSelector((store) => ({
    isAuthenticated: store.isAuthenticated,
    isFetchingUserData: store.isFetchingUserData,
    userToken: store.userToken,
    user: store.user,
    lastOrder: store.lastOrder,
  }));
  const prevUserToken = usePrevious(userToken);
  const prevLastOrder = usePrevious(lastOrder);

  const onLogoutPress = () => {
    dispatch(logout());
    navigation.navigate('Membership');
  };
  const onRegisterPress = () => navigation.navigate('UserRegister');
  const onLoginPress = () => navigation.navigate('Login');
  const fetchUser = () => {
    dispatch(requestUserData(userToken));
  };

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
  };
};
export default useMembership;
