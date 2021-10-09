import React from 'react';
import { Input, Spinner, Button, Text, WarningOutlineIcon, FormControl, ScrollView } from 'native-base';
import { StyleSheet, View } from 'react-native';
import * as EmailValidator from 'email-validator';
import { Controller } from 'react-hook-form';

import theme from '../../theme';
import useUserRegister from './useUserRegister';

const FormInput = ({
  control,
  errors,
  name,
  label,
  rules = {
    required: 'kan ikke være tomt.',
  },
  returnKeyType = 'next',
  ...rest
}) => {
  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormControl isInvalid={Boolean(errors[name])}>
          <FormControl.Label>{label}</FormControl.Label>
          <Input
            ref={ref}
            returnKeyType={returnKeyType}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            {...rest}
          />
          {errors[name] && (
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              <Text>{errors[name].message}</Text>
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      )}
      name={name}
      defaultValue=""
    />
  );
};

const Registerbutton = ({ isDisabled, onPress }) => (
  <Button full disabled={isDisabled} onPress={onPress} style={styles.registerButton}>
    <Text>Registrer meg</Text>
  </Button>
);

const NonFieldErrors = ({ errors }) => {
  if (!Object.keys(errors).length || !['non_field_errors', 'detail'].some((errorField) => errorField in errors)) {
    return null;
  }
  let errorFormatted;
  if ('non_field_errors' in errors) {
    errorFormatted = errors.non_field_errors?.[0];
  } else if ('detail' in errors) {
    errorFormatted = errors.detail;
  }
  if (!errorFormatted) errorFormatted = 'Kunne ikke registrere bruker, prøv igjen...';

  return (
    <View style={styles.errorBox}>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        <Text>{errorFormatted}</Text>
      </FormControl.ErrorMessage>
    </View>
  );
};

const UserRegister = () => {
  const { isRegisteringUser, onSubmit, control, isValid, errors, setFocus } = useUserRegister();
  const isDisabled = isRegisteringUser || !isValid;
  // TODO: validate on type
  // TODO: highlight errorfields

  return (
    <ScrollView>
      <View style={styles.card}>
        <FormInput
          name="firstName"
          label="Fornavn"
          control={control}
          errors={errors}
          autoFocus={true}
          onSubmitEditing={() => setFocus('lastName')}
        />
        <FormInput
          name="lastName"
          label="Etternavn"
          control={control}
          errors={errors}
          onSubmitEditing={() => setFocus('email')}
        />
        <FormInput
          name="email"
          label="E-post"
          control={control}
          errors={errors}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          rules={{
            required: 'kan ikke være tomt.',
            validate: (v) => EmailValidator.validate(v) || 'er ikke en gyldig e-post',
          }}
          onSubmitEditing={() => setFocus('phoneNumber')}
        />
        <FormInput
          name="phoneNumber"
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
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
        <NonFieldErrors errors={errors} />
        <Registerbutton isDisabled={isDisabled} onPress={onSubmit} />
        {isRegisteringUser && <Spinner color="#f58220" />}
      </View>
    </ScrollView>
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
