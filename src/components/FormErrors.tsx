import { FontAwesome5 as Icon } from '@expo/vector-icons';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormErrors = ({ errors }: { errors: Record<string, any> }) => {
  let errorFormatted;
  if ('non_field_errors' in errors) {
    errorFormatted = errors.non_field_errors?.[0];
  } else if ('detail' in errors) {
    errorFormatted = errors.detail;
  }
  if (!errorFormatted) errorFormatted = 'Kunne ikke sende inn skjemaet! Prøv igjen senere...';

  return (
    <View style={styles.container}>
      <Icon name="exclamation-triangle" size={16} color="#b91c1c" style={styles.icon} />
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
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
  },
});

export default FormErrors;
