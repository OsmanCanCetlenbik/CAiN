import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, radius } from '../theme';

type Props = { 
  style?: ViewStyle;
  animated?: boolean;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
};

export default function Skeleton({ 
  style, 
  animated = true, 
  width, 
  height, 
  borderRadius 
}: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, animatedValue]);

  const animatedStyle = animated ? {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  } : {};

  return (
    <Animated.View 
      style={[
        styles.box, 
        {
          width,
          height,
          borderRadius: borderRadius ?? radius.md,
        },
        animatedStyle,
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.borderLight,
  },
});



