import { Alert, HStack } from 'native-base';
import React from 'react';
import { Text } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormErrors = ({ errors }: { errors: Record<string, any> }) => {
  if (!Object.keys(errors).length || !['non_field_errors', 'detail'].some((errorField) => errorField in errors)) {
    return null;
  }

  let errorFormatted;
  if ('non_field_errors' in errors) {
    errorFormatted = errors.non_field_errors?.[0];
  } else if ('detail' in errors) {
    errorFormatted = errors.detail;
  }
  if (!errorFormatted) errorFormatted = 'Kunne ikke sende inn skjemaet, prøv igjen...';

  return (
    <Alert w="100%" colorScheme="error" status="error">
      <HStack space={2} flexShrink={1} w="100%">
        <Alert.Icon mt="1" />
        <Text>{errorFormatted}</Text>
      </HStack>
    </Alert>
  );
};
export default FormErrors;
