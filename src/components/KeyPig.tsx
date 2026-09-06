import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import theme from '@/theme';
import KeyPigSvg from '@assets/key-pig.svg';

// The web's phone-size pig, keeping the artwork's 179:244 ratio
const WIDTH = 128;
const HEIGHT = Math.round((WIDTH * 244) / 179);

type KeyPigProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const KeyPig = ({ color = theme.colors.neufPink, style }: KeyPigProps) => (
  <View pointerEvents="none" style={[styles.pig, style]} testID="key-pig">
    <KeyPigSvg width={WIDTH} height={HEIGHT} color={color} />
  </View>
);

const styles = StyleSheet.create({
  // Web: translate(1vw, 20%) from the corner
  pig: {
    position: 'absolute',
    right: -4,
    bottom: -Math.round(HEIGHT * 0.2),
  },
});

export default KeyPig;
