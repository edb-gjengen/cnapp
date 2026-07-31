import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/auth/AuthContext';
import { useUser } from '@/queries/useUser';

const useMembership = () => {
  const navigation = useNavigation();
  const { isAuthenticated, signOut } = useAuth();
  const { isPending, isRefetching, refetch } = useUser();

  const onLogoutPress = () => {
    signOut();
    navigation.navigate('UserStack', { screen: 'Membership' });
  };
  const onRegisterPress = () => navigation.navigate('UserStack', { screen: 'UserRegister' });
  const onLoginPress = () => navigation.navigate('UserStack', { screen: 'Login' });
  const onDeletePress = () => navigation.navigate('UserStack', { screen: 'UserDelete' });

  return {
    isAuthenticated,
    isPending,
    isRefetching,
    onLogoutPress,
    onRegisterPress,
    onDeletePress,
    onLoginPress,
    fetchUser: refetch,
  };
};
export default useMembership;
