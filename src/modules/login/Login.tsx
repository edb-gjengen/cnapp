import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View, Text, ScrollView } from 'react-native';

import Button from '@/components/Button';
import FormErrors from '@/components/FormErrors';
import FormInput from '@/components/FormInput';
import theme from '@/theme';

import useLogin from './useLogin';

const Login = () => {
  const { isLoggingIn, isSubmitted, errors, loginError, control, setFocus, onSubmit } = useLogin();

  return (
    <ScrollView style={theme.background}>
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
        <Button fullWidth onPress={onSubmit} style={[theme.button, styles.loginButton]}>
          <Text style={theme.buttonText}>Logg inn</Text>
        </Button>
        {loginError && isSubmitted && <FormErrors errors={loginError} />}
        {isLoggingIn && <ActivityIndicator color={theme.colors.neufOrange} />}
        <Button
          small
          onPress={() => {
            Linking.openURL(process.env.EXPO_PUBLIC_DUSKEN_FORGOT_PASSWORD_URL || '');
          }}
          style={[theme.button, styles.forgotPasswordButton]}
        >
          <Text style={theme.buttonText}>Glemt passord?</Text>
        </Button>
      </View>
    </ScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  loginButton: {
    marginVertical: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
});
