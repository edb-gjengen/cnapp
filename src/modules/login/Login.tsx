import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-ui-lib';

import FormErrors from 'src/components/FormErrors';
import FormInput from 'src/components/FormInput';
import theme from 'src/theme';

import useLogin from './useLogin';

const Login = () => {
  const { isLoggingIn, isSubmitted, errors, loginError, control, setFocus, onSubmit } = useLogin();

  return (
    <ScrollView>
      <View style={theme.card}>
        <FormErrors errors={errors} />
        <FormInput
          name="email"
          label="E-post / Brukernavn"
          control={control}
          errors={errors}
          keyboardType="email-address"
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => setFocus('password')}
        />
        <FormInput
          name="password"
          label="Passord"
          control={control}
          errors={errors}
          secureTextEntry
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
            Linking.openURL(process.env.EXPO_PUBLIC_DUSKEN_FORGOT_PASSWORD_URL || '');
          }}
          style={styles.forgotPasswordButton}
        >
          <Text>Glemt passord?</Text>
        </Button>
        {loginError && isSubmitted && <FormErrors errors={loginError} />}
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
});
