import * as EmailValidator from 'email-validator';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, Incubator } from 'react-native-ui-lib';

import FormErrors from 'src/components/FormErrors';
import FormInput from 'src/components/FormInput';
import PrivacyButton from 'src/components/PrivacyButton';
import theme from 'src/theme';

import useUserRegister from './useUserRegister';

const { Toast } = Incubator;

const UserRegister = () => {
  const {
    isRegisteringUser,
    onSubmit,
    isValid,
    isSubmitted,
    control,
    errors,
    registerError,
    setFocus,
    toast,
    setToast,
  } = useUserRegister();
  const isDisabled = isRegisteringUser || !isValid;

  return (
    <>
      <View style={theme.card}>
        <ScrollView>
          <FormInput
            name="first_name"
            label="Fornavn"
            control={control}
            errors={errors}
            autoFocus
            onSubmitEditing={() => setFocus('last_name')}
          />
          <FormInput
            name="last_name"
            label="Etternavn"
            control={control}
            errors={errors}
            onSubmitEditing={() => setFocus('email')}
          />
          <FormInput
            name="email"
            label="E-post"
            keyboardType="email-address"
            control={control}
            errors={errors}
            autoCapitalize="none"
            autoCorrect={false}
            rules={{
              required: 'Kan ikke være tomt!',
              validate: (v) => EmailValidator.validate(v) || 'er ikke en gyldig e-post',
            }}
            onSubmitEditing={() => setFocus('phone_number')}
          />
          <FormInput
            name="phone_number"
            label="Mobilnummer"
            control={control}
            errors={errors}
            keyboardType="phone-pad"
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
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
          <View style={styles.errorBox}>{registerError && isSubmitted && <FormErrors errors={registerError} />}</View>
          <Button fullWidth disabled={isDisabled} onPress={onSubmit} style={styles.registerButton}>
            <Text>Registrer meg</Text>
          </Button>
          {isRegisteringUser && <ActivityIndicator color={theme.colors.neufOrange} />}
          <PrivacyButton />
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
});
