import React from 'react';
import { Container, Input, Spinner, Button, Text, Icon, Toast, FormControl } from 'native-base';
import { StyleSheet, View } from 'react-native';
import * as EmailValidator from 'email-validator';
import { useForm, Controller } from 'react-hook-form';

import theme from '../../theme';
import useUserRegister from './useUserRegister';

const FormInput = ({
  control,
  errors,
  name,
  label,
  rules = {
    required: true,
  },
  returnKeyType = 'next',
  ...rest
}) => {
  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormControl isInvalid={errors.firstName}>
          <FormControl.Label>{label}</FormControl.Label>
          <Input returnKeyType={returnKeyType} onChangeText={onChange} onBlur={onBlur} value={value} {...rest} />
          {errors[name] && (
            <View>
              <Text>kan ikke være tomt.</Text>
              <Icon name="close-circle" />
            </View>
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
  if (Object.keys(errors).length !== 0 && 'non_field_errors' in errors) {
    const err = errors.non_field_errors;
    const errorFormatted = err ? err[0] : 'Kunne ikke registrere bruker, prøv igjen...';
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorMessage}>{errorFormatted}</Text>
      </View>
    );
  }
  if (Object.keys(errors).length !== 0 && 'detail' in errors) {
    const err = errors.detail;
    const errorFormatted = err || 'Kunne ikke registrere bruker, prøv igjen...';
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorMessage}>{errorFormatted}</Text>
      </View>
    );
  }

  return <View style={styles.errorBox} />;
};

const UserRegister = () => {
  const { isRegisteringUser, onRegisterPress } = useUserRegister();
  // TODO: email validation
  // TODO: focus next field

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm();
  const isDisabled = !isDirty || isRegisteringUser || !isValid;
  const onSubmit = (data) => {
    console.log(data);
    // if (!canSubmitForm()) {
    //   Toast.show({
    //     text: 'Noen av feltene er ikke fylt ut riktig',
    //     position: 'bottom',
    //     buttonText: 'OK',
    //     duration: 1500,
    //   });
    //   return;
    // }

    // onRegisterPress(firstName, lastName, email, phoneNumber, password);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.card}>
        <FormInput name="firstName" label="Fornavn" control={control} errors={errors} autoFocus={true} />
        <FormInput name="lastName" label="Etternavn" control={control} errors={errors} />
        <FormInput
          name="email"
          label="E-post"
          control={control}
          errors={errors}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput name="phoneNumber" label="Mobilnummer" control={control} errors={errors} keyboardType="phone-pad" />
        <FormInput
          name="password"
          label="Passord"
          control={control}
          errors={errors}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <NonFieldErrors errors={errors} />
        <Registerbutton isDisabled={isDisabled} onPress={handleSubmit(onSubmit)} />
        {isRegisteringUser && <Spinner color="#f58220" />}
      </View>
    </Container>
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
  errorMessage: {
    textAlign: 'center',
    color: theme.colors.danger,
    fontSize: 14,
  },
  card: theme.card,
  errorText: {
    paddingTop: 2,
    paddingBottom: 12,
  },
});
