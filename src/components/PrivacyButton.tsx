import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import theme from '@/theme';
import { openPrivacyPolicy } from '@/utils';

const PrivacyButton = () => (
  <TouchableOpacity style={[theme.background, styles.button]} onPress={openPrivacyPolicy}>
    <Text style={styles.linkText}>Personvern</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 16,
  },
  linkText: {
    color: theme.colors.neufPurple,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default PrivacyButton;
