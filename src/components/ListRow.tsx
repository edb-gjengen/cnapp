import Icon from '@react-native-vector-icons/feather/static';
import React from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

export type ListRowProps = {
  label: string;
  onPress?: () => void;
  /** Right-hand element, e.g. a Switch */
  accessory?: React.ReactNode;
  /** The program list's arrow, for rows that lead somewhere */
  arrow?: boolean;
  destructive?: boolean;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
};

/** One row in a ListSection: a label with an optional accessory, pressable when given onPress */
const ListRow = ({ label, onPress, accessory, arrow, destructive, accessibilityRole, testID }: ListRowProps) => {
  const content = (
    <>
      <Text style={[theme.text, styles.label, destructive && styles.destructive]}>{label}</Text>
      {accessory}
      {arrow && <Icon name="arrow-right" size={20} color={theme.colors.chateauBlue} />}
    </>
  );

  if (!onPress) {
    return (
      <View style={styles.row} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      testID={testID}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...theme.typography.body,
    flex: 1,
  },
  destructive: {
    color: theme.colors.danger,
  },
});

export default ListRow;
