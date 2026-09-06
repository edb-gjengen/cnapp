import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View, ScrollView } from 'react-native';

import Button from '@/components/Button';
import FormErrors from '@/components/FormErrors';
import FormInput from '@/components/FormInput';
import KeyPig from '@/components/KeyPig';
import theme from '@/theme';
import { withAppSource } from '@/utils';

import useLogin from './useLogin';

const Login = () => {
  const { isLoggingIn, isSubmitted, errors, loginError, control, setFocus, onSubmit } = useLogin();

  return (
    <View style={styles.screen}>
      <KeyPig color={theme.colors.white} />
      <ScrollView>
        <View style={theme.card}>
          {errors && <FormErrors errors={errors} />}
          <FormInput
            name="email"
            label="E-post / Brukernavn"
            control={control}
            errors={errors}
            keyboardType="email-address"
            autoFocus
            autoCapitalize="none"
            autoComplete="email"
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
            autoComplete="current-password"
            onSubmitEditing={onSubmit}
            returnKeyType="send"
          />
          <Button variant="primary" fullWidth onPress={onSubmit} style={styles.loginButton}>
            Logg inn
          </Button>
          {loginError && isSubmitted && <FormErrors errors={loginError} />}
          {isLoggingIn && (
            <ActivityIndicator accessible accessibilityRole="progressbar" color={theme.colors.goldenOrange} />
          )}
          <Button
            small
            onPress={() => {
              Linking.openURL(withAppSource(process.env.EXPO_PUBLIC_DUSKEN_FORGOT_PASSWORD_URL || ''));
            }}
            style={styles.forgotPasswordButton}
          >
            Glemt passord?
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loginButton: {
    marginVertical: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
});
