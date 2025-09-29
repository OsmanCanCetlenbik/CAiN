import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

// Geçici placeholder görsel (FAL entegrasyonundan önce demo için):
const PLACEHOLDERS: Record<string, string> = {
  christmas_table: 'https://images.unsplash.com/photo-1512386233331-5c180f0b5b4e?q=80&w=1200&auto=format&fit=crop',
  beach_cafe: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
  minimal_office: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
};

export default function ResultsScreen({ route, navigation }: Props) {
  const { imageUri, preset } = route.params;
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Şimdilik: 1 sn bekleyip preset’e göre placeholder gösteriyoruz.
    // Bir sonraki adımda burayı FAL API çağrısı ile değiştireceğiz.
    const t = setTimeout(() => {
      setResultUrl(PLACEHOLDERS[preset]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [preset]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sonuç</Text>
      <Text style={styles.sub}>Seçilen preset: {preset}</Text>

      {loading ? (
        <View style={[styles.preview, styles.center]}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>CAiN görsel üretiyor...</Text>
        </View>
      ) : (
        <>
          <Image source={{ uri: resultUrl ?? '' }} style={styles.preview} />
          <View style={styles.row}>
            <Button title="Farklı Tarz" onPress={() => navigation.goBack()} />
            <Button title="Başa Dön" onPress={() => navigation.navigate('Upload')} />
          </View>
        </>
      )}

      <Text style={styles.note}>
        Not: Bu ekran şu an demo görseli gösteriyor. Bir sonraki adımda FAL API ile gerçek üretime geçeceğiz.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600' },
  sub: { color: '#333' },
  preview: { width: '100%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#f2f2f2' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  center: { alignItems: 'center', justifyContent: 'center' },
  note: { color: '#666' },
});
