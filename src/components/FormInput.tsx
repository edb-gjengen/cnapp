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
            label={label}
            accessibilityLabel={label}
            returnKeyType={returnKeyType}
            onChangeText={onChange}
            onBlur={onBlur}
            fieldStyle={fieldError ? styles.fieldWithError : undefined}
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
  fieldWithError: {
    borderColor: theme.colors.danger,
  },
  errorMessage: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginBottom: 4,
    marginLeft: 16,
  },
});

export default FormInput;
