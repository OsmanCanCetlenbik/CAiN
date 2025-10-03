// src/screens/IntroScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useI18n } from '../i18n';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../state/AuthContext';

export default function IntroScreen({ navigation }: any) {
  const { t } = useI18n();
  const { signInGuest } = useAuth();
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const step1 = useRef(new Animated.Value(0)).current;
  const step2 = useRef(new Animated.Value(0)).current;
  const step3 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeLogo, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeTitle, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeSubtitle, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.stagger(150, [
        Animated.timing(step1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(step2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(step3, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleGuest = async () => {
    await signInGuest();
    // ❌ navigation.replace('Upload') yok artık
    // ✅ Auth state değişince AppNavigator otomatik Upload'a geçecek
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Animated.Text style={[styles.logo, { opacity: fadeLogo, transform: [{ translateY: fadeLogo.interpolate({ inputRange: [0,1], outputRange: [12,0] }) }] }]}>CAiN</Animated.Text>
        <Animated.Text style={[styles.title, { opacity: fadeTitle }]}>{t('intro_title')}</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: fadeSubtitle }]}>{t('intro_subtitle')}</Animated.Text>
      </View>

      <View style={styles.steps}>
        <Animated.Text style={[styles.step, { opacity: step1, transform: [{ translateY: step1.interpolate({ inputRange: [0,1], outputRange: [8,0] }) }] }]}>{t('intro_step1')}</Animated.Text>
        <Animated.Text style={[styles.step, { opacity: step2, transform: [{ translateY: step2.interpolate({ inputRange: [0,1], outputRange: [8,0] }) }] }]}>{t('intro_step2')}</Animated.Text>
        <Animated.Text style={[styles.step, { opacity: step3, transform: [{ translateY: step3.interpolate({ inputRange: [0,1], outputRange: [8,0] }) }] }]}>{t('intro_step3')}</Animated.Text>
      </View>

      <Animated.View style={{ transform: [{ scale: pulse }], gap: spacing.md }}>
        <PrimaryButton 
          title={t('intro_cta')} 
          onPress={() => navigation.navigate('Auth')}
          size="large" 
        />
        <PrimaryButton 
          title={t('guest_try')}
          onPress={handleGuest}
          variant="outline"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary, padding: spacing.xl, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: spacing.xl },
  logo: { ...typography.h1, marginBottom: spacing.md },
  title: { ...typography.h2, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.subtitle, textAlign: 'center' },
  steps: { gap: spacing.md },
  step: { ...typography.title },
});
