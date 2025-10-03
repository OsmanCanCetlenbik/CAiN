import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { colors, typography } from '../theme';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <Animated.View style={[styles.container, { opacity: fade }] }>
      <Text style={styles.logo}>CAiN</Text>
      <ActivityIndicator color={colors.primary} size="large" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    ...typography.h1,
  },
});


