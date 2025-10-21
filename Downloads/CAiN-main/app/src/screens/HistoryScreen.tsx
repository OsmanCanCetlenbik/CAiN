import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useHistoryList } from '../state/HistoryContext';
import type { HistoryItem } from '../state/HistoryContext';
import { useAuth } from '../state/AuthContext';
import { colors, spacing, typography, radius, shadows } from '../theme';

/** Yerel user yapısı ile uyumlu (AuthContext’inden gelen) */
type SupaUserLike = {
  email?: string | null;
  user_metadata?: {
    full_name?: string | null;
  } | null;
  identities?: Array<{ identity_data?: { email?: string | null } | null }> | null;
} | null;

function getEmail(u: SupaUserLike): string | null {
  return u?.email ?? u?.identities?.[0]?.identity_data?.email ?? null;
}

/** Türkçe iyelik eki */
function genitiveTr(name: string) {
  const apostrophe = '’';
  const lower = name.toLocaleLowerCase('tr');
  const lastVowel = [...lower].reverse().find(c => 'aeıioöuü'.includes(c)) ?? 'i';
  const map: Record<string, string> = {
    a: 'nın', ı: 'nın',
    e: 'nin', i: 'nin',
    o: 'nun', u: 'nun',
    ö: 'nün', ü: 'nün',
  };
  return `${name}${apostrophe}${map[lastVowel] ?? 'nin'}`;
}

export default function HistoryScreen() {
  const { items, loading, remove, toggleFavorite, clearAll } = useHistoryList();
  const { user } = useAuth() as { user: SupaUserLike };

  const confirmClear = () =>
    Alert.alert('Geçmişi Temizle', 'Tüm kayıtlar silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => clearAll() },
    ]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Geçmiş yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>🎨 Henüz üretim yok</Text>
          <Text style={styles.emptySubtitle}>
            {user ? 'İlk üretimini yap, burada göreceksin!' : 'Giriş yap ve üretimlerini takip et!'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const email = getEmail(user);
  const rawName =
    user?.user_metadata?.full_name?.trim?.() ||
    (email ? email.split('@')[0] : null) ||
    'Kullanıcı';
  const headerTitle = user ? `${genitiveTr(rawName)} Geçmişi` : 'Geçmiş';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {headerTitle} ({items.length})
          </Text>
          <TouchableOpacity onPress={confirmClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Temizle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i: HistoryItem) => i.id}
        renderItem={({ item }: { item: HistoryItem }) => (
          <View style={styles.card}>
            <View style={styles.imageRow}>
              <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Orijinal</Text>
                <Image source={{ uri: item.inputUri }} style={styles.thumb} />
              </View>
              <View style={styles.arrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
              <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Sonuç</Text>
                <Image source={{ uri: item.outputUri }} style={styles.thumb} />
              </View>
            </View>

            <View style={styles.meta}>
              <Text style={styles.preset}>{item.preset}</Text>
              <Text style={styles.date}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : ''}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={[styles.actionButton, item.favorite && styles.favoriteButton]}
              >
                <Text style={[styles.actionText, item.favorite && styles.favoriteText]}>
                  {item.favorite ? '★ Favori' : '☆ Favori'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => remove(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>🗑 Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  title: { 
    ...typography.h2,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.danger + '20',
    borderRadius: radius.sm,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: { 
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  imageRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  thumb: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  arrow: {
    paddingHorizontal: spacing.md,
  },
  arrowText: {
    fontSize: 18,
    color: colors.primary,
  },
  meta: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  preset: { 
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  date: { 
    ...typography.caption,
    color: colors.textSecondary,
  },
  /** <-- Hatalı anahtar "actio" kaldırıldı ve aşağıdakiler eklendi */
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  favoriteButton: {
    backgroundColor: colors.primary + '20',
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  favoriteText: {
    color: colors.primary,
  },
  deleteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.danger + '20',
  },
  deleteText: {
    ...typography.caption,
    color: colors.danger,
  },
});
