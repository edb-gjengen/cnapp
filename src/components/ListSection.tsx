import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

type ListSectionProps = {
  title?: string;
  children: React.ReactNode;
};

/** Grouped rows on a card with separators, like a settings screen */
const ListSection = ({ title, children }: ListSectionProps) => {
  const rows = React.Children.toArray(children);

  return (
    <View style={styles.section}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.card}>
        {rows.map((row, index) => (
          // Rows are static per section, so the index is a stable key
          <React.Fragment key={index}>
            {index > 0 && <View style={styles.separator} />}
            {row}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  title: {
    ...theme.typography.suphead,
    color: theme.colors.chateauBlue05,
    marginHorizontal: 32,
    marginBottom: 8,
  },
  // Rounded like buttons: the rows are actions, not a content surface
  card: {
    backgroundColor: theme.colors.betongGrayDarkened,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  // The web's subtle border
  separator: {
    height: 1,
    backgroundColor: theme.colors.chateauBlue05,
  },
});

export default ListSection;
