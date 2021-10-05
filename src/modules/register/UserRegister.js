import React, { useState, useEffect, useRef } from 'react';
import { Container, Input, Spinner, Button, Text, Icon, Toast, FormControl } from 'native-base';
import { StyleSheet, View } from 'react-native';
import * as EmailValidator from 'email-validator';

import theme from '../../theme';
import useUserRegister from './useUserRegister';

const UserRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(new Set());
  const { isRegisteringUser, onRegisterPress } = useUserRegister();

  const emailInputRef = useRef();
  const lastNameInputRef = useRef();
  const phoneInputRef = useRef();
  const passwordInputRef = useRef();

  const validateForm = (triggeredBy) => {
    const values = { firstName, lastName, email, phoneNumber, password };

    const freshErrors = { ...errors };
    const freshTouched = new Set(touched).add(triggeredBy);

    /* No empty fields */
    Object.entries(values).forEach(([key, value]) => {
      if (value === '') {
        freshErrors[key] = 'kan ikke være tomt';
      } else if (key === 'email' && !EmailValidator.validate(value)) {
        freshErrors[key] = 'er ikke en gyldig e-post';
      } else {
        delete freshErrors[key];
      }
    });
    setErrors(freshErrors);
    setTouched(freshTouched);
  };

  const fieldHasError = (field) => {
    return touched.has(field) && field in errors;
  };

  const canSubmitForm = () => {
    return Object.keys(errors).length === 0;
  };

  // useEffect(() => {
  //   if (prevRegisterError !== registerError) {
  //     setErrors(registerError);
  //   }
  // }, []);

  const showFieldError = (field) => {
    if (!fieldHasError(field)) {
      return null;
    }
    return (
      <FormControl style={styles.errorText}>
        <Text style={styles.errorMessage}>{errors[field]}</Text>
      </FormControl>
    );
  };

  const firstNameInput = () => {
    return (
      <FormControl isInvalid={fieldHasError('firstName')}>
        <FormControl.Label>Fornavn</FormControl.Label>
        <Input
          autoFocus={true}
          returnKeyType="next"
          onChangeText={(value) => {
            setFirstName(value);
            validateForm('firstName');
          }}
          onSubmitEditing={() => {
            lastNameInputRef.current.focus();
          }}
          value={firstName}
        />
        {fieldHasError('firstName') && <Icon name="close-circle" />}
      </FormControl>
    );
  };

  const lastNameInput = () => {
    return (
      <FormControl isInvalid={fieldHasError('lastName')}>
        <FormControl.Label>Etternavn</FormControl.Label>
        <Input
          ref={lastNameInputRef}
          returnKeyType="next"
          onChangeText={(value) => {
            setLastName(value);
            validateForm('lastName');
          }}
          onSubmitEditing={() => {
            emailInputRef.current.focus();
          }}
          value={lastName}
        />
        {fieldHasError('lastName') && <Icon name="close-circle" />}
      </FormControl>
    );
  };

  const emailInput = () => {
    return (
      <FormControl isInvalid={fieldHasError('email')}>
        <FormControl.Label>E-post</FormControl.Label>
        <Input
          ref={emailInputRef}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onChangeText={(value) => {
            setEmail(value);
            validateForm('email');
          }}
          onSubmitEditing={() => {
            phoneInputRef.current.focus();
          }}
          value={email}
        />
        {fieldHasError('email') && <Icon name="close-circle" />}
      </FormControl>
    );
  };

  const phoneNumberInput = () => {
    return (
      <FormControl isInvalid={fieldHasError('phoneNumber')}>
        <FormControl.Label>Mobilnummer</FormControl.Label>
        <Input
          ref={phoneInputRef}
          returnKeyType="next"
          keyboardType="phone-pad"
          onChangeText={(value) => {
            setPhoneNumber(value);
            validateForm('phoneNumber');
          }}
          onSubmitEditing={() => {
            passwordInputRef.current.focus();
          }}
          value={phoneNumber}
        />
        {fieldHasError('phoneNumber') && <Icon name="close-circle" />}
      </FormControl>
    );
  };
  const passwordInput = () => {
    return (
      <FormControl isInvalid={fieldHasError('password')}>
        <FormControl.Label>Passord</FormControl.Label>
        <Input
          ref={passwordInputRef}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => {
            setPassword(value);
            validateForm('password');
          }}
          onSubmitEditing={onRegisterPress}
          value={password}
        />
        {fieldHasError('password') && <Icon name="close-circle" />}
      </FormControl>
    );
  };
  const showNonFieldError = () => {
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

  const onSubmit = () => {
    if (!canSubmitForm()) {
      Toast.show({
        text: 'Noen av feltene er ikke fylt ut riktig',
        position: 'bottom',
        buttonText: 'OK',
        duration: 1500,
      });
      return;
    }

    onRegisterPress(firstName, lastName, email, phoneNumber, password);
  };

  const registerbutton = () => {
    const isDisabled = touched.size === 0 || isRegisteringUser || !canSubmitForm();

    return (
      <Button full disabled={isDisabled} onPress={onSubmit} style={styles.registerButton}>
        <Text>Registrer meg</Text>
      </Button>
    );
  };

  return (
    <Container style={styles.container}>
      <View style={styles.card}>
        {firstNameInput()}
        {showFieldError('firstName')}
        {lastNameInput()}
        {showFieldError('lastName')}
        {emailInput()}
        {showFieldError('email')}
        {phoneNumberInput()}
        {showFieldError('phoneNumber')}
        {passwordInput()}
        {showFieldError('password')}
        {showNonFieldError()}
        {registerbutton()}
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
