import * as EmailValidator from 'email-validator';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Incubator } from 'react-native-ui-lib';

import FormErrors from 'src/components/FormErrors';
import FormInput from 'src/components/FormInput';
import theme from 'src/theme';

import useUserRegister from './useUserRegister';

const { Toast } = Incubator;

const UserRegister = () => {
  const { isRegisteringUser, onSubmit, isValid, errors, registerError, setFocus, toast, setToast } = useUserRegister();
  const isDisabled = isRegisteringUser || !isValid;
  // TODO: validate on type
  // TODO: highlight errorfields

  return (
    <>
      <View style={styles.card}>
        <ScrollView>
          <FormInput name="firstName" label="Fornavn" autoFocus onSubmitEditing={() => setFocus('lastName')} />
          <FormInput name="lastName" label="Etternavn" onSubmitEditing={() => setFocus('email')} />
          <FormInput
            name="email"
            label="E-post"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            rules={{
              required: 'Kan ikke være tomt!',
              validate: (v) => EmailValidator.validate(v) || 'er ikke en gyldig e-post',
            }}
            onSubmitEditing={() => setFocus('phoneNumber')}
          />
          <FormInput
            name="phoneNumber"
            label="Mobilnummer"
            keyboardType="phone-pad"
            onSubmitEditing={() => setFocus('password')}
          />
          <FormInput
            name="password"
            label="Passord"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
          <View style={styles.errorBox}>
            <FormErrors errors={errors} />
            <FormErrors errors={registerError} />
          </View>
          <Button fullWidth disabled={isDisabled} onPress={onSubmit} style={styles.registerButton}>
            <Text>Registrer meg</Text>
          </Button>
          {isRegisteringUser && <ActivityIndicator color={theme.colors.neufOrange} />}
        </ScrollView>
      </View>
      <Toast
        message={toast?.message}
        visible={toast?.visible}
        position="bottom"
        autoDismiss={5 * 1000}
        onDismiss={() => {
          setToast(null);
        }}
      />
    </>
  );
};

export default UserRegister;

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
  registerButton: {
    marginBottom: 16,
  },
  errorBox: {
    marginVertical: 10,
  },
  card: theme.card,
});
