import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

type BulletListProps = {
  items: string[];
};

/** Unordered list with neuf.no's orange dot bullets */
const BulletList = ({ items }: BulletListProps) => (
  <View accessibilityRole="list">
    {items.map((item) => (
      <View key={item} style={styles.item}>
        <View style={styles.bullet} />
        <Text style={[theme.text, styles.text]}>{item}</Text>
      </View>
    ))}
  </View>
);

// Metrics from the web's rich text lists at a 16px body size
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 6,
    marginBottom: 12,
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.goldenOrange,
    marginTop: 6,
    marginRight: 14,
  },
  text: {
    ...theme.typography.body,
    flex: 1,
  },
});

export default BulletList;
