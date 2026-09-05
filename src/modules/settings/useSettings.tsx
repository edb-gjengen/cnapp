import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { useAuth } from '@/auth/AuthContext';
import { useUser } from '@/queries/useUser';
import { openPrivacyPolicy } from '@/utils';

const useSettings = () => {
  const navigation = useNavigation();
  const { isAuthenticated, signOut } = useAuth();
  const { user } = useUser();

  // Not a screen for logged-out users
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('UserStack', { screen: 'Membership' });
    }
  }, [isAuthenticated, navigation]);

  const onDeletePress = () => navigation.navigate('UserStack', { screen: 'UserDelete' });

  return {
    user,
    onLogoutPress: signOut,
    onDeletePress,
    onPrivacyPress: openPrivacyPolicy,
  };
};
export default useSettings;
