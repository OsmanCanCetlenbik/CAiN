import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius, typography, shadows } from '../theme';
import { useAuth } from '../state/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const { signIn, signInGuest } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);
      await signIn({ username, password, isSignUp });
      // Not: Giriş sonrası yönlendirmeyi AppNavigator auth gating yapıyor
    } catch (e) {
      console.error('Auth failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>{isSignUp ? '🚀' : '👋'}</Text>
          <Text style={styles.title}>
            {isSignUp ? 'CAiN\'e Kayıt Ol' : 'CAiN\'e Hoş Geldin'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp 
              ? 'Üretimlerine kolayca erişmek için bilgilerini gir'
              : 'Hesabına giriş yap ve üretimlerine devam et'
            }
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}</Text>
          <Text style={styles.formSubtitle}>
            {isSignUp ? 'Kullanıcı adı ve şifre belirle' : 'Kullanıcı adı ve şifrenle giriş yap'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
            <TextInput
              placeholder="kullaniciadi"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>

          <PrimaryButton 
            title={isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            onPress={() => handleContinue()}
            loading={loading}
            size="large"
            style={styles.continueButton}
          />

          <TouchableOpacity 
            style={styles.switchModeButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchModeText}>
              {isSignUp ? 'Zaten hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: spacing.md }} />
          <PrimaryButton 
            title="Misafir olarak devam et (1 deneme)"
            onPress={async () => { await signInGuest(); navigation.navigate('Upload'); }}
            variant="outline"
          />
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Neler Yapabilirsin?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎨</Text>
              <Text style={styles.featureText}>10+ farklı tema ile görsel oluştur</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>10 saniyede profesyonel sonuçlar</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💾</Text>
              <Text style={styles.featureText}>Geçmişini kaydet ve yönet</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.note}>
            💡 Bilgilerin sadece cihazında saklanır. İstediğin zaman çıkış yapabilirsin.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: { 
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    color: colors.textMuted,
  },
  
  // Form Card
  formCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  formTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  formSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: { 
    borderWidth: 2, 
    borderColor: colors.border, 
    borderRadius: radius.lg, 
    padding: spacing.md,
    ...typography.body,
    backgroundColor: colors.background,
  },
  
  // Guest Mode
  guestMode: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  guestIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  guestTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  guestSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  
  // Continue Button
  continueButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  
  // Guest Toggle
  guestToggle: {
    alignItems: 'center',
  },
  guestToggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Features Card
  featuresCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  featuresTitle: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
  },
  switchModeButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  switchModeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  
  // Note
  noteContainer: {
    alignItems: 'center',
  },
  note: { 
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
