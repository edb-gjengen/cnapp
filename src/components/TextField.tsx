import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

export type TextFieldProps = TextInputProps & {
  label?: React.ReactNode;
  fieldStyle?: StyleProp<ViewStyle | TextStyle>;
};

const TextField = React.forwardRef<TextInput, TextFieldProps>(({ label, fieldStyle, style, ...rest }, ref) => (
  <View style={styles.container}>
    {label != null &&
      (typeof label === 'string' || typeof label === 'number' ? <Text style={styles.label}>{label}</Text> : label)}
    <TextInput ref={ref} style={[styles.input, fieldStyle, style]} {...rest} />
  </View>
));

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
  },
});

export default TextField;
