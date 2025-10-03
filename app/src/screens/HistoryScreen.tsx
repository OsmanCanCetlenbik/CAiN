import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useHistoryList } from '../state/HistoryContext';

export default function HistoryScreen() {
  const { items, loading, remove, toggleFavorite, clearAll } = useHistoryList();

  const confirmClear = () =>
    Alert.alert('Geçmişi Temizle', 'Tüm kayıtlar silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => clearAll() },
    ]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor…</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Henüz geçmiş yok.</Text>
        <Text style={{ color: '#666' }}>Üretim yaptıktan sonra burada göreceksin.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 8 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Geçmiş ({items.length})</Text>
        <TouchableOpacity onPress={confirmClear}>
          <Text style={{ color: '#c00' }}>Tümünü Sil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.inputUri }} style={styles.thumb} />
              <Image source={{ uri: item.outputUri }} style={styles.thumb} />
            </View>
            <View style={styles.meta}>
              <Text style={styles.preset}>{item.preset}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Text style={{ color: item.favorite ? '#e91e63' : '#666' }}>
                  {item.favorite ? '★ Favori' : '☆ Favori'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={{ color: '#c00' }}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f6f6f6', gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  thumb: { width: '49%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#eee' },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  preset: { fontWeight: '600' },
  date: { color: '#666' },
});
