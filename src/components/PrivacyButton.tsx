import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

import theme from '@/theme';
import { withAppSource } from '@/utils';

const PrivacyButton = () => (
  <TouchableOpacity
    style={[theme.background, styles.button]}
    onPress={() => Linking.openURL(withAppSource(process.env.EXPO_PUBLIC_DUSKEN_PRIVACY_POLICY_URL || ''))}
  >
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
