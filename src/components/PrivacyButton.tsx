import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import theme from '@/theme';
import { openPrivacyPolicy } from '@/utils';

const PrivacyButton = () => (
  <TouchableOpacity style={styles.button} onPress={openPrivacyPolicy}>
    <Text style={styles.linkText}>Personvern</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 16,
  },
  linkText: {
    ...theme.typography.body,
    color: theme.colors.chateauBlue,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default PrivacyButton;
