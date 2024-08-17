import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import IconExclamationTriangle from 'assets/icons/exclamation-triangle.svg';
import theme from 'src/theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormErrors = ({ errors }: { errors: Record<string, any> }) => {
  if (!errors) {
    return [];
  }

  let errorFormatted;
  if (errors instanceof Error) {
    // This check might backfire on us as it's too general. We do not wish to display the error message to the user
    // Hence we display this generic one
    errorFormatted = 'Kunne ikke sende inn skjemaet! Prøv igjen senere...';
  } else if ('non_field_errors' in errors) {
    errorFormatted = errors.non_field_errors?.[0];
  } else if ('detail' in errors) {
    errorFormatted = errors.detail;
  }

  if (!errorFormatted) {
    return [];
  }

  return (
    <View style={styles.container}>
      <IconExclamationTriangle width={20} height={20} style={styles.icon} />
      <View>
        <Text>{errorFormatted}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fecaca',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.danger
  },
  icon: {
    marginRight: 8,
  },
});

export default FormErrors;
