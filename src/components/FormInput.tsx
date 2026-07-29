import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { ReturnKeyTypeOptions, Text, StyleSheet } from 'react-native';

import TextField, { TextFieldProps } from '@/components/TextField';
import theme from '@/theme';

type FormInputProps = {
  errors: any;

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
            label={<Text style={theme.text}>{label}</Text>}
            accessibilityLabel={label}
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
    borderColor: theme.colors.neufPurple,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
    padding: 4,
    marginVertical: 4,
  },
  fieldWithError: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
  },
  errorMessage: {
    color: theme.colors.danger,
    marginBottom: 4,
  },
});

export default FormInput;
