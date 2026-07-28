import React, { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';

import theme from '@/theme';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonProps {
  data: RadioOption[];
  onSelect: (value: string) => void;
  defaultValue: RadioOption;
}

export default function RadioButton({ data, onSelect, defaultValue }: RadioButtonProps) {
  const [userOption, setUserOption] = useState(defaultValue.value);

  const selectHandler = (value: string) => {
    onSelect(value);
    setUserOption(value);
  };

  return (
    <>
      {data.map((item) => {
        return (
          <Pressable
            key={item.value}
            style={[styles.box, item.value === userOption ? styles.selected : styles.unselected]}
            onPress={() => selectHandler(item.value)}
          >
            <Text style={styles.text}>{item.label}</Text>
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    margin: 4,
    borderRadius: 12,
  },
  selected: {
    backgroundColor: theme.colors.neufOrange,
  },
  unselected: {
    backgroundColor: theme.colors.gray1,
  },
  text: {
    textAlign: 'center',
  },
});
