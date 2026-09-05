import React from 'react';
import { AccessibilityRole, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

export type ListRowProps = {
  label: string;
  onPress?: () => void;
  /** Right-hand element, e.g. a Switch */
  accessory?: React.ReactNode;
  /** Disclosure glyph, for rows that lead somewhere */
  chevron?: boolean;
  destructive?: boolean;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
};

/** One row in a ListSection: a label with an optional accessory, pressable when given onPress */
const ListRow = ({ label, onPress, accessory, chevron, destructive, accessibilityRole, testID }: ListRowProps) => {
  const content = (
    <>
      <Text style={[theme.text, styles.label, destructive && styles.destructive]}>{label}</Text>
      {accessory}
      {chevron && <Text style={styles.chevron}>›</Text>}
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
    backgroundColor: theme.colors.neufWhite,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  destructive: {
    color: theme.colors.danger,
  },
  chevron: {
    color: theme.colors.lightText,
    fontSize: 22,
    lineHeight: 22,
    marginLeft: 8,
  },
});

export default ListRow;
