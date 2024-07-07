import { Input, Text, WarningOutlineIcon, FormControl, IInputProps } from 'native-base';
import React from 'react';
import { Controller, UseControllerProps, useForm } from 'react-hook-form';
import { ReturnKeyTypeOptions } from 'react-native';

type FormInputProps = {
  name: string;
  label: string;
  rules?: UseControllerProps['rules'];
  returnKeyType?: ReturnKeyTypeOptions;
} & IInputProps;

const FormInput = ({
  name,
  label,
  rules = {
    required: 'Kan ikke være tomt!',
  },
  returnKeyType = 'next',
  ...rest
}: FormInputProps) => {
  const {
    formState: { errors },
    control,
  } = useForm();
  const fieldError = errors[name];
  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormControl isInvalid={Boolean(fieldError)}>
          <FormControl.Label>{label}</FormControl.Label>
          <Input
            ref={ref}
            returnKeyType={returnKeyType}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            {...rest}
          />
          {fieldError && (
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              <Text>{fieldError.message.toString()}</Text>
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      )}
      name={name}
      defaultValue=""
    />
  );
};
export default FormInput;
