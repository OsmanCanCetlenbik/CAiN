import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// removed inline language toggle for tighter header
import { useI18n } from '../i18n';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing, typography, shadows } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

export default function UploadScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { t } = useI18n();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf seçmek için galeri izni vermelisin.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const goNext = () => {
    if (!imageUri) {
      Alert.alert('Uyarı', 'Lütfen bir ürün fotoğrafı seç.');
      return;
    }
    navigation.navigate('Style', { imageUri });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('upload_title')}</Text>
        <Text style={styles.subtitle}>{t('upload_subtitle')}</Text>
      </View>

      {/* Upload Area */}
      <View style={styles.uploadSection}>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.changeButtonText}>Değiştir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            <View style={styles.uploadContent}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadTitle}>{t('select_photo')}</Text>
              <Text style={styles.uploadSubtitle}>
                Galerinden bir fotoğraf seç veya çek
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 {t('tips_title')}</Text>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t('tip_1')}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t('tip_2')}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t('tip_3')}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <PrimaryButton 
          title={t('continue')} 
          onPress={goNext}
          disabled={!imageUri}
          size="large"
          style={styles.continueButton}
        />
        
        <View style={styles.secondaryActions}>
          <PrimaryButton 
            title={t('view_history')}
            onPress={() => navigation.navigate('History')}
            variant="outline"
            style={styles.historyButton}
          />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  scrollBody: {
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  
  // Header
  header: { marginBottom: spacing.lg },
  title: { 
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  
  // Upload Section
  uploadSection: { marginBottom: spacing.lg },
  uploadArea: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    ...shadows.sm,
  },
  uploadContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadTitle: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  uploadSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Image Preview
  imageContainer: {
    position: 'relative',
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  changeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  changeButtonText: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  
  // Tips Card
  tipsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  tipsTitle: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipBullet: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  tipText: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textSecondary,
  },
  
  // Actions
  actionsSection: { marginTop: 'auto', paddingBottom: spacing.lg },
  continueButton: {
    marginBottom: spacing.md,
  },
  secondaryActions: {
    alignItems: 'center',
  },
  historyButton: {
    minWidth: 120,
  },
});
