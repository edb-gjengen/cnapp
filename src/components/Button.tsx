import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import theme from '@/theme';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  small?: boolean;
  children?: React.ReactNode;
};

const Button = ({ style, fullWidth, small, disabled, children, ...rest }: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    style={({ pressed }) => [
      styles.base,
      small && styles.small,
      fullWidth && styles.fullWidth,
      style,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ]}
    {...rest}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.neufBeige,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
