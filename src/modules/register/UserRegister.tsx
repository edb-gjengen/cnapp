import * as EmailValidator from 'email-validator';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, ScrollView } from 'react-native';

import Button from '@/components/Button';
import FormErrors from '@/components/FormErrors';
import FormInput from '@/components/FormInput';
import PrivacyButton from '@/components/PrivacyButton';
import theme from '@/theme';

import useUserRegister from './useUserRegister';

const UserRegister = () => {
  const { isRegisteringUser, onSubmit, isValid, isSubmitted, control, errors, registerError, setFocus } =
    useUserRegister();
  const isDisabled = isRegisteringUser || !isValid;

  return (
    <>
      <ScrollView style={theme.card}>
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
        {registerError && isSubmitted && <FormErrors errors={registerError} />}
        {isRegisteringUser && (
          <ActivityIndicator accessible accessibilityRole="progressbar" color={theme.colors.neufOrange} />
        )}
        <Button fullWidth disabled={isDisabled} onPress={onSubmit} style={[theme.button, styles.registerButton]}>
          <Text style={theme.buttonText}>Registrer meg</Text>
        </Button>
      </ScrollView>
      <PrivacyButton />
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
    marginVertical: 16,
  },
});
