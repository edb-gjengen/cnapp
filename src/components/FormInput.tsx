import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { ReturnKeyTypeOptions, Text, StyleSheet } from 'react-native';
import { TextField, TextFieldProps } from 'react-native-ui-lib';

import theme from 'src/theme';

type FormInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  rules?: UseControllerProps['rules'];
  returnKeyType?: ReturnKeyTypeOptions;
} & TextFieldProps;

const FormInput = ({
  errors,
  control,
  name,
  label,
  rules = {
    required: 'Kan ikke være tomt!',
  },
  returnKeyType = 'next',
  ...rest
}: FormInputProps) => {
  const fieldError = errors[name];
  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          <TextField
            ref={ref}
            label={label}
            returnKeyType={returnKeyType}
            onChangeText={onChange}
            onBlur={onBlur}
            fieldStyle={[styles.field, fieldError ? styles.fieldWithError : undefined]}
            value={value}
            {...rest}
          />
          {fieldError && <Text style={styles.errorMessage}>{fieldError.message?.toString()}</Text>}
        </>
      )}
      name={name}
      defaultValue=""
    />
  );
};

const styles = StyleSheet.create({
  field: {
    borderColor: theme.colors.gray1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginVertical: 4,
  },
  fieldWithError: {
    borderColor: theme.colors.danger,
  },
  errorMessage: {
    color: theme.colors.danger,
    marginBottom: 4,
  },
});

export default FormInput;
