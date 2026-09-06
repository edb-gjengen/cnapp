import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '@/theme';

type SvgComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

export type TabIconProps = {
  icon: SvgComponent;
  focused: boolean;
  color: string;
  size: number;
};

export const PILL_SIZE = { width: 60, height: 32 };

const TabIcon = ({ icon: Icon, focused, color, size }: TabIconProps) => (
  <View style={[styles.pill, focused && styles.pillActive]}>
    <Icon width={size} height={size} color={focused ? theme.tabBar.pill.text : color} />
  </View>
);

const styles = StyleSheet.create({
  pill: {
    ...PILL_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: theme.tabBar.pill.background,
  },
});

export default TabIcon;
