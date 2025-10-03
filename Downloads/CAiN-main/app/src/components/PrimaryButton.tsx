import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
};

export default function PrimaryButton({ 
  title, 
  onPress, 
  loading, 
  variant = 'primary',
  size = 'medium',
  style,
  disabled = false
}: Props) {
  const isDisabled = loading || disabled;
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        // Better disabled styling for outline: keep readable
        isDisabled && !isOutline && { opacity: 0.6 },
        isDisabled && isOutline && { backgroundColor: '#E5E7FF', borderColor: colors.primaryDark },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} size="small" />
      ) : (
        <Text style={[
          styles.label,
          styles[`${size}Label`],
          styles[`${variant}Label`],
          isDisabled && isOutline && { color: colors.text }
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    ...shadows.sm,
    minHeight: 48,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: colors.primary,
    // add subtle fill for readability on light background
    shadowOpacity: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  
  // Labels
  label: {
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#FFFFFF',
  },
  outlineLabel: {
    color: colors.text,
  },
  ghostLabel: {
    color: colors.primary,
  },
  
  // Label sizes
  smallLabel: {
    fontSize: typography.buttonSmall.fontSize,
    fontWeight: typography.buttonSmall.fontWeight,
  },
  mediumLabel: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  largeLabel: {
    fontSize: 18,
    fontWeight: typography.button.fontWeight,
  },
});



