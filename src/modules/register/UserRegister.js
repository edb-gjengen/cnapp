import React from 'react';
import { Spinner, Button, Text, ScrollView } from 'native-base';
import { StyleSheet, View } from 'react-native';
import * as EmailValidator from 'email-validator';

import theme from '../../theme';
import useUserRegister from './useUserRegister';
import FormInput from '../../components/FormInput';
import FormErrors from '../../components/FormErrors';

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
        <View style={styles.errorBox}>
          <FormErrors errors={errors} />
        </View>
        <Button full disabled={isDisabled} onPress={onSubmit} style={styles.registerButton}>
          <Text>Registrer meg</Text>
        </Button>
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
