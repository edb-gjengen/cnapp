import Icon from '@react-native-vector-icons/feather/static';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type SettingsHeaderButtonProps = {
  /** Header tint from the navigator, so the icon matches the title */
  tintColor?: string;
};

const SettingsHeaderButton = ({ tintColor }: SettingsHeaderButtonProps) => {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Innstillinger"
      hitSlop={8}
      onPress={() => navigation.navigate('UserStack', { screen: 'UserSettings' })}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name="settings" size={24} color={tintColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default SettingsHeaderButton;
