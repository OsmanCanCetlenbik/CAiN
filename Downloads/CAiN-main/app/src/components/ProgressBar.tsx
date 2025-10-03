import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, radius } from '../theme';

type Props = { 
  progress?: number; // 0..1, yoksa sonsuz animasyon yerine ince bar
  animated?: boolean;
  height?: number;
};

export default function ProgressBar({ progress, animated = true, height = 6 }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated && progress !== undefined) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated, animatedValue]);

  const widthPercent = progress !== undefined ? Math.min(1, Math.max(0, progress)) * 100 : 35;
  
  return (
    <View style={[styles.track, { height }]}>
      <Animated.View 
        style={[
          styles.fill, 
          { 
            width: animated && progress !== undefined 
              ? animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              : `${widthPercent}%`,
            height 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.borderLight,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});



