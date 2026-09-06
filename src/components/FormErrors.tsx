import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { ApiError } from '@/errors';
import theme from '@/theme';
import IconExclamationTriangle from '@assets/icons/exclamation-triangle.svg';

const FormErrors = ({ errors }: { errors: Record<string, any> | Error }) => {
  if (!errors) {
    return [];
  }

  // ApiError carries the DRF body; unwrap before the instanceof Error check
  const fields: Record<string, any> = errors instanceof ApiError ? errors.fields : (errors as Record<string, any>);

  let errorFormatted;
  if (fields instanceof Error) {
    // This check might backfire on us as it's too general. We do not wish to display the error message to the user
    // Hence we display this generic one
    errorFormatted = 'Kunne ikke sende inn skjemaet! Prøv igjen senere...';
  } else if ('non_field_errors' in fields) {
    errorFormatted = fields.non_field_errors?.[0];
  } else if ('detail' in fields) {
    errorFormatted = fields.detail;
  }

  if (!errorFormatted) {
    return [];
  }

  return (
    <View style={styles.container}>
      <IconExclamationTriangle width={20} height={20} fill={theme.colors.white} style={styles.icon} />
      <Text style={[theme.typography.body, styles.message]}>{errorFormatted}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.danger,
    padding: 12,
    borderRadius: 4,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    color: theme.colors.white,
  },
});

export default FormErrors;
