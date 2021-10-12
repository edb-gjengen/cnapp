import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ScrollView, Spinner, Button, Text } from 'native-base';
import Config from 'react-native-config';

import theme from '../../theme';
import useLogin from './useLogin';
import FormInput from '../../components/FormInput';
import FormErrors from '../../components/FormErrors';

const Login = ({ onLogin }) => {
  const { isLoggingIn, errors, control, setFocus, onSubmit } = useLogin(onLogin);

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
        <Button full onPress={onSubmit} style={styles.loginButton}>
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
