import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import theme from '@/theme';

export type TextFieldProps = TextInputProps & {
  label?: React.ReactNode;
  fieldStyle?: StyleProp<ViewStyle | TextStyle>;
};

// The text colour at 60%, as on neuf.no
const PLACEHOLDER_COLOR = `${theme.colors.chateauBlue}99`;

/** Labelled input styled like neuf.no: a white pill with a blue border that turns orange on focus */
const TextField = React.forwardRef<TextInput, TextFieldProps>(
  ({ label, fieldStyle, style, onFocus, onBlur, placeholderTextColor, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={styles.container}>
        {label != null &&
          (typeof label === 'string' || typeof label === 'number' ? <Text style={styles.label}>{label}</Text> : label)}
        <TextInput
          ref={ref}
          style={[styles.input, focused && styles.inputFocused, fieldStyle, style]}
          placeholderTextColor={placeholderTextColor ?? PLACEHOLDER_COLOR}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
      </View>
    );
  },
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.chateauBlue,
    fontWeight: '500',
    marginBottom: 4,
    marginLeft: 16,
  },
  input: {
    backgroundColor: theme.colors.white,
    color: theme.colors.chateauBlue,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: theme.colors.chateauBlue,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: theme.colors.goldenOrange,
  },
});

export default TextField;
