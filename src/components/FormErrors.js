import React from 'react';
import { Alert, HStack, Text } from 'native-base';

const FormErrors = ({ errors }) => {
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
