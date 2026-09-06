import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import theme from '@/theme';

export type ButtonVariant = keyof typeof theme.buttons;

export type ButtonProps = Omit<PressableProps, 'style'> & {
  /** primary is the orange call to action, secondary the beige one, as on neuf.no */
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  /** Applies when children is a string */
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  small?: boolean;
  children?: React.ReactNode;
};

const Button = ({
  variant = 'secondary',
  style,
  textStyle,
  icon,
  fullWidth,
  small,
  disabled,
  children,
  ...rest
}: ButtonProps) => {
  const colors = theme.buttons[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colors.background },
        small && styles.small,
        fullWidth && styles.fullWidth,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...rest}
    >
      {icon}
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: colors.text }, small && styles.textSmall, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 14,
  },
});

export default Button;
