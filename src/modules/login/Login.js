import { ScrollView } from 'native-base';
import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-ui-lib';

import useLogin from './useLogin';
import FormErrors from '../../components/FormErrors';
import FormInput from '../../components/FormInput';
import theme from '../../theme';

const Login = () => {
  const { isLoggingIn, errors, control, setFocus, onSubmit } = useLogin();

  return (
    <ScrollView>
      <View style={styles.card}>
        <FormErrors errors={errors} />
        <FormInput
          name="email"
          label="E-post / Brukernavn"
          keyboardType="email-address"
          control={control}
          errors={errors}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => setFocus('password')}
        />
        <FormInput
          name="password"
          label="Passord"
          secureTextEntry
          control={control}
          errors={errors}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
        />
        <Button fullWidth onPress={onSubmit} style={styles.loginButton}>
          <Text>Logg inn</Text>
        </Button>
        <Button
          small
          light
          onPress={() => {
            Linking.openURL(process.env.EXPO_PUBLIC_DUSKEN_FORGOT_PASSWORD_URL);
          }}
          style={styles.forgotPasswordButton}
        >
          <Text>Glemt passord?</Text>
        </Button>
        {isLoggingIn && <ActivityIndicator color={theme.colors.neufOrange} />}
      </View>
    </ScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  card: theme.card,
});
