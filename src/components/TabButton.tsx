import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable } from 'react-native';

// The stock button's borderless Android ripple flashes a circle well past the tab; the pill is feedback enough
const TabButton = ({
  android_ripple,
  pressColor,
  pressOpacity,
  hoverEffect,
  ref,
  ...props
}: BottomTabBarButtonProps) => <Pressable {...props} />;

export default TabButton;
