import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, type StyleProp } from 'react-native';
import { colors, radius } from '../theme';

type DimensionValue = NonNullable<ViewStyle['width']>;

type Props = {
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
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
        } as ViewStyle,
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



