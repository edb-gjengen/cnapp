import Icon from '@react-native-vector-icons/feather/static';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

export interface RadioOption {
  label: string;
  value: string;
  /** Secondary text on the right, e.g. a price */
  detail?: string;
}

interface RadioButtonProps {
  data: RadioOption[];
  onSelect: (value: string) => void;
  defaultValue: RadioOption;
}

/** Pill togglers as on neuf.no: outlined when idle, filled with a ticked dot when selected */
export default function RadioButton({ data, onSelect, defaultValue }: RadioButtonProps) {
  const [userOption, setUserOption] = useState(defaultValue.value);

  const selectHandler = (value: string) => {
    onSelect(value);
    setUserOption(value);
  };

  return (
    <View accessibilityRole="radiogroup" style={styles.group}>
      {data.map((item) => {
        const selected = item.value === userOption;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={item.detail ? `${item.label}, ${item.detail}` : item.label}
            onPress={() => selectHandler(item.value)}
            style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
          >
            <Text style={[styles.label, selected && styles.textSelected]}>{item.label}</Text>
            {item.detail && <Text style={[styles.detail, selected && styles.textSelected]}>{item.detail}</Text>}
            <View style={styles.dot}>
              {selected && <Icon name="check" size={12} color={theme.colors.chateauBlue} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.chateauBlue,
  },
  optionSelected: {
    backgroundColor: theme.colors.chateauBlue,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    flex: 1,
    color: theme.colors.chateauBlue,
    fontSize: 16,
    fontWeight: '500',
  },
  detail: {
    color: theme.colors.chateauBlue,
    fontSize: 16,
    marginRight: 12,
  },
  textSelected: {
    color: theme.colors.white,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.chateauBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
