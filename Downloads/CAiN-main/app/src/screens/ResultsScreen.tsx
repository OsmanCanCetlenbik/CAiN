import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, Share, Linking, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useI18n } from '../i18n';
import { colors, spacing, radius, typography, shadows } from '../theme';
import ProgressBar from '../components/ProgressBar';
import Skeleton from '../components/Skeleton';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { generateImage, getPlaceholderForPreset } from '../services/falService';
import { useCredits } from '../state/CreditsContext';
import { useHistoryList } from '../state/HistoryContext';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { imageUri, preset } = route.params;
  const { t } = useI18n();
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [variantUrls, setVariantUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { credits, loading: creditsLoading, consume } = useCredits();
  const { add: addHistory } = useHistoryList();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>{t('back') ?? 'Geri'}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Upload')} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>{t('change_photo') ?? 'Fotoğraf Değiştir'}</Text>
        </TouchableOpacity>
      ),
    });

    let cancelled = false;

    const run = async () => {
      if (creditsLoading) return; // krediler yüklenmeden bekle

      // 1) Kredi kontrol + tüketim
      const ok = await consume(1);
      if (!ok) {
        navigation.replace('Paywall'); // kredi yoksa Paywall’a
        return;
      }

      // 2) Görsel üret
      setLoading(true);
      const res = await generateImage({ imageUri, preset });
      if (cancelled) return;

      if (res.ok && res.url) {
        setResultUrl(res.url);

        // 3) Geçmişe kaydet
        try {
          await addHistory({ inputUri: imageUri, outputUri: res.url, preset });
        } catch (e) {
          // history hatası uygulamayı bozmasın
          console.warn('History add error:', e);
        }
      } else {
        if (res.errorCode === 'FAL_EXHAUSTED_BALANCE') {
          // Bakiye bitti ise kullanıcıya bilgilendirici uyarı ve placeholder ile devam
          const placeholder = getPlaceholderForPreset(preset);
          setResultUrl(placeholder);
          Alert.alert(
            'Bakiye Tükendi',
            'FAL krediniz bittiği için örnek görsel gösteriliyor. Bakiye yükledikten sonra tekrar deneyin.'
          );
        } else {
          Alert.alert('Üretim Hatası', res.error ?? 'Bilinmeyen hata');
        }
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [imageUri, preset, creditsLoading]);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('nav_results')}</Text>
          <Text style={styles.subtitle}>{t('style_select_subtitle')} {preset}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingSection}>
            <View style={styles.loadingCard}>
              <ProgressBar progress={0.4} height={8} />
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>CAiN görsel üretiyor...</Text>
                <Text style={styles.loadingSubtext}>Bu işlem birkaç saniye sürebilir</Text>
              </View>
              <Skeleton height={60} />
              <Skeleton height={60} />
            </View>
          </View>
        ) : variantUrls.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>4 Varyant Hazır! 🎉</Text>
            <View style={styles.variantsGrid}>
              {variantUrls.map((url, idx) => (
                <TouchableOpacity key={url + idx} style={styles.variantCard}>
                  <Image source={{ uri: url }} style={styles.variantImage} />
                  <Text style={styles.variantLabel}>Varyant {idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.actionButtons}>
              <PrimaryButton 
                title={t('share') ?? 'Paylaş'} 
                onPress={() => Share.share({ url: variantUrls[0], message: variantUrls[0] })}
                variant="outline"
                style={styles.actionButton}
              />
              <PrimaryButton 
                title={t('open_link') ?? 'Linki Aç'} 
                onPress={() => Linking.openURL(variantUrls[0])}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.navigationButtons}>
              <PrimaryButton 
                title={t('different_style') ?? 'Farklı Tarz'} 
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.navButton}
              />
              <PrimaryButton 
                title={t('go_start') ?? 'Başa Dön'} 
                onPress={() => navigation.navigate('Upload')}
                variant="outline"
                style={styles.navButton}
              />
            </View>
          </View>
        ) : resultUrl ? (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>{t('image_ready') ?? 'Görsel Hazır! ✨'}</Text>
            
            <View style={styles.mainResult}>
              <Image source={{ uri: resultUrl }} style={styles.mainImage} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageLabel}>Ana Sonuç</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <PrimaryButton 
                title={t('generate_4_variants') ?? '4 Varyant Üret'} 
                onPress={async () => {
                  try {
                    setLoading(true);
                    setVariantUrls([]);
                    const okCredits = await consume(4);
                    if (!okCredits) {
                      setLoading(false);
                      navigation.replace('Paywall');
                      return;
                    }
                    const results: string[] = [];
                    for (let i = 0; i < 4; i++) {
                      const r = await generateImage({ imageUri, preset });
                      if (r.ok && r.url) results.push(r.url);
                    }
                    setVariantUrls(results);
                  } catch (e) {
                    Alert.alert(t('variant_error_title') ?? 'Varyant Üretim Hatası', t('try_again') ?? 'Tekrar deneyin.');
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="outline"
                style={styles.primaryAction}
              />
            </View>
            
            <View style={styles.secondaryActions}>
              <PrimaryButton 
                title={t('share') ?? 'Paylaş'} 
                onPress={() => Share.share({ url: resultUrl, message: resultUrl })}
                variant="outline"
                style={styles.secondaryButton}
              />
              <PrimaryButton 
                title={t('open_link') ?? 'Linki Aç'} 
                onPress={() => resultUrl && Linking.openURL(resultUrl)}
                variant="outline"
                style={styles.secondaryButton}
              />
            </View>
            
            <View style={styles.navigationButtons}>
              <PrimaryButton 
                title={t('different_style') ?? 'Farklı Tarz'} 
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.navButton}
              />
              <PrimaryButton 
                title={t('view_history')} 
                onPress={() => navigation.navigate('History')}
                variant="outline"
                style={styles.navButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.errorSection}>
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>😔</Text>
              <Text style={styles.errorTitle}>{t('image_not_fetched') ?? 'Görsel Alınamadı'}</Text>
              <Text style={styles.errorMessage}>
                {t('something_wrong_try_again') ?? 'Bir sorun oluştu. Lütfen tekrar deneyin.'}
              </Text>
              <PrimaryButton 
                title={t('try_again') ?? 'Tekrar Dene'} 
                onPress={() => navigation.replace('Results', { imageUri, preset })}
                style={styles.retryButton}
              />
            </View>
          </View>
        )}

        {/* Credits Info */}
        <View style={styles.creditsCard}>
          <Text style={styles.creditsLabel}>Mevcut Kredi</Text>
          <Text style={styles.creditsValue}>{credits}</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: { paddingBottom: spacing.xl },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  
  // Header
  header: {
    marginBottom: spacing.sm,
  },
  title: { 
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
  },
  
  // Loading Section
  loadingSection: {
    marginBottom: spacing.xl,
  },
  loadingCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  loadingContent: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.title,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  
  // Results Section
  resultsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  // Main Result
  mainResult: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  imageOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  imageLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  // Variants Grid
  variantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  variantCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.sm,
    ...shadows.sm,
  },
  variantImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
  },
  variantLabel: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  
  // Action Buttons
  actionButtons: {
    marginBottom: spacing.lg,
  },
  primaryAction: {
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  secondaryButton: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  navButton: {
    flex: 1,
  },
  
  // Error Section
  errorSection: {
    marginBottom: spacing.xl,
  },
  errorCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    minWidth: 140,
  },
  
  // Credits Card
  creditsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  creditsLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  creditsValue: {
    ...typography.title,
    color: colors.primary,
  },
});
