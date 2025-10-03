import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../i18n';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, typography, radius, shadows } from '../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Style'>;

const PRESETS = [
  { 
    key: 'christmas_table', 
    label: 'Noel Masası', 
    category: 'Sezonluk',
    icon: '🎄',
    description: 'Sıcak ve festiv hava'
  },
  { 
    key: 'beach_cafe', 
    label: 'Sahil Kafe', 
    category: 'Açık Hava',
    icon: '🏖️',
    description: 'Rahatlatıcı sahil atmosferi'
  },
  { 
    key: 'minimal_office', 
    label: 'Minimal Ofis', 
    category: 'Modern',
    icon: '💼',
    description: 'Temiz ve profesyonel'
  },
  { 
    key: 'brand_lora_demo', 
    label: 'LoRA: Marka Stili', 
    category: 'Özel',
    icon: '🎨',
    description: 'Markana özel stil'
  },
  { 
    key: 'cozy_living_room', 
    label: 'Sıcak Salon', 
    category: 'Ev',
    icon: '🏠',
    description: 'Sıcak ve samimi'
  },
  { 
    key: 'industrial_loft', 
    label: 'Endüstriyel Loft', 
    category: 'Modern',
    icon: '🏭',
    description: 'Ham ve çağdaş'
  },
  { 
    key: 'marble_kitchen', 
    label: 'Mermer Mutfak', 
    category: 'Lüks',
    icon: '🍽️',
    description: 'Şık ve zarif'
  },
  { 
    key: 'rustic_wood_table', 
    label: 'Rustik Ahşap', 
    category: 'Doğal',
    icon: '🌲',
    description: 'Doğal ve organik'
  },
  { 
    key: 'botanical_studio', 
    label: 'Botanik Stüdyo', 
    category: 'Doğal',
    icon: '🌿',
    description: 'Yeşil ve canlı'
  },
  { 
    key: 'neon_cyberpunk', 
    label: 'Neon Cyberpunk', 
    category: 'Fütüristik',
    icon: '🤖',
    description: 'Teknolojik ve parlak'
  },
  { 
    key: 'dark_mood', 
    label: 'Koyu Mood', 
    category: 'Dramatik',
    icon: '🌙',
    description: 'Gizemli ve etkileyici'
  },
  { 
    key: 'pastel_minimal', 
    label: 'Pastel Minimal', 
    category: 'Modern',
    icon: '🌸',
    description: 'Yumuşak ve sakin'
  },
  { 
    key: 'outdoor_picnic', 
    label: 'Açık Hava Piknik', 
    category: 'Açık Hava',
    icon: '🧺',
    description: 'Doğal ve rahat'
  },
  { 
    key: 'luxury_showcase', 
    label: 'Lüks Vitrin', 
    category: 'Lüks',
    icon: '💎',
    description: 'Premium ve şık'
  },
];

const CATEGORIES_KEYS = ['category_all','category_modern','category_natural','category_luxury','category_outdoor','category_seasonal','category_custom','category_futuristic','category_dramatic','category_home'] as const;

export default function StyleScreen({ route, navigation }: Props) {
  const { imageUri } = route.params;
  const [selectedCategory, setSelectedCategory] = React.useState('category_all');
  const { t } = useI18n();

  const choosePreset = (preset: string) => {
    navigation.navigate('Results', { imageUri, preset });
  };

  const filteredPresets = selectedCategory === 'category_all' 
    ? PRESETS 
    : PRESETS.filter(preset => preset.category === t(selectedCategory).replace(/^(Tümü|All)$/,'Tümü'));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('style_select_title')}</Text>
        <Text style={styles.subtitle}>{t('style_select_subtitle')}</Text>
      </View>

      {/* Category Filter - wrapped chips */}
      <View style={styles.categoryWrap}>
        {CATEGORIES_KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryChip,
              selectedCategory === key && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(key)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === key && styles.categoryTextActive
            ]}>
              {t(key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Style Grid */}
      <ScrollView style={styles.stylesScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.stylesGrid}>
          {filteredPresets.map((preset) => (
            <TouchableOpacity
              key={preset.key}
              style={styles.styleCard}
              onPress={() => choosePreset(preset.key)}
            >
              <View style={styles.styleCardContent}>
                <Text style={styles.styleIcon}>{preset.icon}</Text>
                <Text style={styles.styleLabel}>{preset.label}</Text>
                <Text style={styles.styleDescription} numberOfLines={1}>{preset.description}</Text>
                <View style={styles.styleCategory}>
                  <Text style={styles.styleCategoryText}>{preset.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hint}>
          💡 Seçtiğin tarza göre CAiN görsel üretecek
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundSecondary,
  },
  
  // Header
  header: { paddingHorizontal: spacing.lg, paddingTop: 0, paddingBottom: 0 },
  title: { 
    ...typography.h2,
    marginBottom: 0,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: 0,
    marginBottom: 0,
  },
  
  // Category Filter
  categoryWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 28,
    minWidth: 80,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  categoryText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  
  // Styles Grid
  stylesScroll: {
    flex: 1,
  },
  stylesGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  styleCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  styleCardContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  styleIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  styleLabel: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  styleDescription: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 0,
  },
  styleCategory: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  styleCategoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Hint
  hintContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  hint: { 
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  
  // Bottom padding for scroll
  bottomPadding: {
    height: spacing.xl,
  },
});
