import { Input, Text, WarningOutlineIcon, FormControl } from 'native-base';
import React from 'react';
import { Controller } from 'react-hook-form';

const FormInput = ({
  control,
  errors,
  name,
  label,
  rules = {
    required: 'Kan ikke være tomt!',
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
export default FormInput;
