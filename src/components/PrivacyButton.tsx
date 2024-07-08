import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

import theme from 'src/theme';

const PrivacyButton = () => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_DUSKEN_PRIVACY_POLICY_URL)}
  >
    <Text style={styles.linkText}>Personvern</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    margin: 16,
  },
  linkText: {
    color: theme.colors.neufBlue,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default PrivacyButton;
