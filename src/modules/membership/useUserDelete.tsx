import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { requestDeleteUser } from 'src/api';
import { useAppDispatch, useAppSelector, usePrevious } from 'src/hooks';

const useUserDelete = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useAppSelector((store) => store.isAuthenticated);
  const isAuthenticatedPrev = usePrevious(isAuthenticated);
  const userToken = useAppSelector((store) => store.userToken);
  const isDeletingUser = useAppSelector((store) => store.isDeletingUser);
  const deleteUserError = useAppSelector((store) => store.deleteUserError);

  const onPress = () => {
    dispatch(requestDeleteUser(userToken || ''));
  };

  useEffect(() => {
    if (isAuthenticatedPrev !== isAuthenticated && !isAuthenticated) {
      navigation.navigate('UserStack', { screen: 'Membership' });
    }
  }, [isAuthenticatedPrev, isAuthenticated, navigation]);

  return {
    onPress,
    isDeletingUser,
    deleteUserError,
  };
};
export default useUserDelete;
