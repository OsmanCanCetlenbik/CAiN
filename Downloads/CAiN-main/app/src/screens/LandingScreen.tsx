import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useI18n } from '../i18n';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { useAuth } from '../state/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { t, setLocale } = useI18n();
  const [showLang, setShowLang] = React.useState(false);

  const cta = () => {
    if (user) navigation.replace('Upload');
    else navigation.replace('Auth');
  };

  const features = [
    { icon: '⚡', title: t('feat_fast'), desc: t('feat_fast_desc') },
    { icon: '🎨', title: t('feat_variety'), desc: t('feat_variety_desc') },
    { icon: '📱', title: t('feat_easy'), desc: t('feat_easy_desc') },
    { icon: '💎', title: t('feat_quality'), desc: t('feat_quality_desc') },
  ];

  return (
    <>
    <Modal transparent visible={showLang} animationType="fade" onRequestClose={() => setShowLang(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '80%' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Dil / Language</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <TouchableOpacity onPress={async () => { await setLocale('tr'); setShowLang(false); }} style={{ flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>🇹🇷</Text>
              <Text style={{ fontWeight: '600' }}>Türkçe</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => { await setLocale('en'); setShowLang(false); }} style={{ flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>🇬🇧</Text>
              <Text style={{ fontWeight: '600' }}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={{ position: 'absolute', right: spacing.lg, top: spacing.lg, zIndex: 5 }}>
          <TouchableOpacity onPress={() => setShowLang(true)} style={{ backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontWeight: '600' }}>🌐 {t('locale_button') ?? 'Language'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroContent}>
          <Text style={styles.badge}>✨ {t('ai_powered')}</Text>
          <Text style={styles.title}>
            {t('hero_line1')}{'\n'}
            <Text style={styles.titleAccent}>{t('hero_line2')}</Text>
          </Text>
          <Text style={styles.subtitle}>
            {t('hero_sub_1')}{' '}
            <Text style={styles.subtitleAccent}>{t('hero_sub_2')}</Text> {t('hero_sub_3')}
          </Text>
        </View>
        
        <View style={styles.heroImage}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.heroImg}
          />
          <View style={styles.imageOverlay} />
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </View>
        ))}
      </View>

      {/* Benefits */}
      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>{t('why_cain')}</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>{t('benefit_1')}</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>{t('benefit_2')}</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>{t('benefit_3')}</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        {user ? (
          <>
            <PrimaryButton 
              title={t('continue_to_upload') ?? 'Yüklemeye Devam'} 
              onPress={() => navigation.navigate('Upload')} 
              size="large"
              style={styles.ctaButton}
            />
            <PrimaryButton 
              title={t('sign_out') ?? 'Çıkış Yap'} 
              onPress={async () => {
                await signOut();
              }} 
              variant="outline"
              style={styles.ctaButton}
            />
          </>
        ) : (
          <>
            <PrimaryButton 
              title={t('sign_in_start') ?? 'Giriş Yap ve Başla'} 
              onPress={() => navigation.navigate('Auth')} 
              size="large"
              style={styles.ctaButton}
            />
            <PrimaryButton 
              title={t('continue_guest') ?? 'Misafir Olarak Devam'} 
              onPress={() => navigation.navigate('Upload')} 
              variant="outline"
              style={styles.ctaButton}
            />
          </>
        )}
        <Text style={styles.ctaHint}>{t('free_trial_hint')}</Text>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundSecondary,
  },
  
  // Hero Section
  hero: {
    marginBottom: spacing.xl,
  },
  heroContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  badge: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },
  subtitleAccent: {
    color: colors.primary,
    fontWeight: '600',
  },
  heroImage: {
    position: 'relative',
    marginHorizontal: spacing.lg,
  },
  heroImg: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.xl,
    ...shadows.lg,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: radius.xl,
  },
  
  // Features Grid
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  featureCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  
  // Benefits Card
  benefitsCard: {
    backgroundColor: colors.surfaceElevated,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  benefitsTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  benefitsList: {
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  benefitText: {
    ...typography.body,
    flex: 1,
  },
  
  // CTA Section
  ctaSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  ctaHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});



