import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View, StyleSheet } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import Button from '@/components/Button';
import FormErrors from '@/components/FormErrors';
import TextField from '@/components/TextField';
import { useUser } from '@/queries/useUser';
import theme from '@/theme';

import useUserDelete from './useUserDelete';

const UserDelete = () => {
  const [value, onChangeText] = React.useState('');
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const { onPress, isDeletingUser, deleteUserError } = useUserDelete();

  // Not a screen for logged-out users; this also leaves after a successful deletion
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('UserStack', { screen: 'Membership' });
    }
  }, [isAuthenticated, navigation]);

  if (!user) {
    return null;
  }

  const isDisabled = !isDeletingUser && value !== user.username;

  return (
    <ScrollView>
      <View style={theme.card}>
        <Text style={styles.headerTitle}>Slett meg</Text>
        <Text style={styles.paragraph}>
          Dette sletter kontoen med brukernavn <Text style={styles.bold}>{user.username}</Text> inkludert all tilknyttet
          personinformasjon <Text style={styles.bold}>for alltid</Text>.
        </Text>
        <Text style={styles.paragraph}>Skriv inn brukernavnet ditt for å fortsette.</Text>
        <TextField
          label="Brukernavn"
          accessibilityLabel="Brukernavn"
          maxLength={32}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          value={value}
        />
        {deleteUserError && <FormErrors errors={deleteUserError} />}
        <Button onPress={onPress} disabled={isDisabled} style={styles.deleteButton} textStyle={styles.whiteText}>
          Jeg forstår, slett kontoen min
        </Button>
        {isDeletingUser && (
          <ActivityIndicator accessible accessibilityRole="progressbar" color={theme.colors.goldenOrange} />
        )}
      </View>
    </ScrollView>
  );
};

export default UserDelete;

const styles = StyleSheet.create({
  paragraph: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.black,
    paddingBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.danger,
  },
  whiteText: {
    color: theme.colors.white,
  },
  headerTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    color: theme.colors.black,
    paddingVertical: 10,
  },
});
