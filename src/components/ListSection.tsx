import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '@/theme';

type ListSectionProps = {
  title?: string;
  children: React.ReactNode;
};

/** Grouped rows on a white card with hairline separators, like a settings screen */
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
    color: theme.colors.lightText,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 32,
    marginBottom: 8,
  },
  card: {
    backgroundColor: theme.colors.neufWhite,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.gray1,
    marginLeft: 16,
  },
});

export default ListSection;
