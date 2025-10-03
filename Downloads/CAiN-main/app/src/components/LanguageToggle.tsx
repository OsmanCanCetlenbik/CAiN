import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { useI18n } from '../i18n';

type Props = { style?: ViewStyle };

export default function LanguageToggle({ style }: Props) {
  const { locale, setLocale } = useI18n();

  const toggle = () => setLocale(locale === 'tr' ? 'en' : 'tr');

  return (
    <TouchableOpacity onPress={toggle} style={[styles.button, style]} activeOpacity={0.8}>
      <Text style={styles.label}>{locale.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    ...shadows.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
});


