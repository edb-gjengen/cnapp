import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

import FormErrors from 'src/components/FormErrors';
import { useAppSelector } from 'src/hooks';
import theme from 'src/theme';

import useUserDelete from './useUserDelete';

const UserDelete = () => {
  const [value, onChangeText] = React.useState('');
  const user = useAppSelector((state) => state.user);
  const { onPress, isDeletingUser, deleteUserError } = useUserDelete();

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
          persondata <Text style={styles.bold}>for alltid</Text>.
        </Text>
        <Text style={styles.paragraph}>Skriv inn brukernavnet ditt for å fortsette.</Text>
        <TextInput
          editable
          numberOfLines={1}
          maxLength={40}
          autoCapitalize="none"
          onChangeText={(text) => onChangeText(text)}
          value={value}
          style={styles.input}
        />
        {deleteUserError && <FormErrors errors={deleteUserError} />}
        <Button
          onPress={onPress}
          disabled={isDisabled}
          style={!isDisabled ? styles.deleteButton : styles.deleteButtonDisabled}
        >
          <Text style={!isDisabled ? styles.whiteText : styles.disabledText}>Jeg forstår, slett kontoen min</Text>
        </Button>
        {isDeletingUser && <ActivityIndicator color={theme.colors.neufOrange} />}
      </View>
    </ScrollView>
  );
};

export default UserDelete;

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.neufBlack,
    paddingBottom: 10,
    lineHeight: 25,
  },
  bold: {
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.danger,
  },
  deleteButtonDisabled: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.neufGray,
  },
  whiteText: {
    color: theme.colors.neufWhite,
  },
  disabledText: {
    opacity: 0.5,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.colors.neufBlack,
    paddingVertical: 10,
    lineHeight: 25,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
});
