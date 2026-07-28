import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import theme from '@/theme';

export type ToastProps = {
  message?: string;
  visible?: boolean;
  position?: 'top' | 'bottom';
  autoDismiss?: number;
  onDismiss?: () => void;
};

const Toast = ({ message, visible, position = 'bottom', autoDismiss, onDismiss }: ToastProps) => {
  const [mounted, setMounted] = useState(!!visible);
  const [opacity] = useState(() => new Animated.Value(0));

  if (visible && !mounted) {
    setMounted(true);
  }

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      if (autoDismiss) {
        timer = setTimeout(() => onDismissRef.current?.(), autoDismiss);
      }
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, autoDismiss, opacity]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, position === 'top' ? styles.top : styles.bottom, { opacity }]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: theme.colors.neufBlack,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  top: {
    top: 48,
  },
  bottom: {
    bottom: 48,
  },
  message: {
    color: theme.colors.neufWhite,
    textAlign: 'center',
    fontSize: 15,
  },
});

export default Toast;
