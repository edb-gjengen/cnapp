import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/auth/AuthContext';
import { useUser } from '@/queries/useUser';

const useMembership = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { isPending, isRefetching, refetch } = useUser();

  const onRegisterPress = () => navigation.navigate('UserStack', { screen: 'UserRegister' });
  const onLoginPress = () => navigation.navigate('UserStack', { screen: 'Login' });

  return {
    isAuthenticated,
    isPending,
    isRefetching,
    onRegisterPress,
    onLoginPress,
    fetchUser: refetch,
  };
};
export default useMembership;
