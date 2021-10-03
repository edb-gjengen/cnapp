import React, { useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Container, Input, Spinner, Button, Text } from 'native-base';
import Config from 'react-native-config';

import theme from '../../theme';
import useLogin from './useLogin';

const FormErrors = ({ loginError }) => {
  if (!loginError) {
    return <View style={styles.errorBox} />;
  }
  const err = loginError.non_field_errors;
  const errorFormatted = err ? err[0] : 'Feil brukernavn eller passord, prøv igjen...';
  // TODO: Format these and highlight error fields
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorMessage}>{errorFormatted}</Text>
    </View>
  );
};

const Login = ({ onLogin }) => {
  const passwordInputRef = useRef();
  const { password, setPassword, email, setEmail, loginError, onLoginPress, isLoggingIn } = useLogin(onLogin);

  // FIXME: highlight fields with errors
  // const usernameHasError = Boolean(loginError?.username);
  // const passwordHasError = Boolean(loginError?.password);

  return (
    <Container style={styles.container}>
      <FormErrors loginError={loginError} />
      <Text>E-post / Brukernavn</Text>
      <Input
        keyboardType="email-address"
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onChangeText={setEmail}
        value={email}
        onSubmitEditing={() => {
          passwordInputRef.current.focus();
        }}
      />
      <Text>Passord</Text>
      <Input
        ref={passwordInputRef}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        value={password}
        onSubmitEditing={onLoginPress}
      />
      <Button full onPress={onLoginPress} style={styles.loginButton}>
        <Text>Logg inn</Text>
      </Button>
      <Button
        small
        light
        onPress={() => {
          Linking.openURL(Config.DUSKEN_FORGOT_PASSWORD_URL);
        }}
        style={styles.forgotPasswordButton}
      >
        <Text>Glemt passord?</Text>
      </Button>
      {isLoggingIn && <Spinner color="#f58220" />}
    </Container>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    width: 320,
    fontSize: 20,
    height: 52,
  },
  loginButton: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  errorBox: {
    marginVertical: 10,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
  },
  card: theme.card,
});
