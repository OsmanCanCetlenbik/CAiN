import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { generateImage } from '../services/falService';
import { useCredits } from '../state/CreditsContext';
import { useHistoryList } from '../state/HistoryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { imageUri, preset } = route.params;
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { credits, loading: creditsLoading, consume } = useCredits();
  const { add: addHistory } = useHistoryList();

  useEffect(() => {
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
        Alert.alert('Üretim Hatası', res.error ?? 'Bilinmeyen hata');
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [imageUri, preset, creditsLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sonuç</Text>
      <Text style={styles.sub}>Seçilen preset: {preset}</Text>

      {loading ? (
        <View style={[styles.preview, styles.center]}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>CAiN görsel üretiyor...</Text>
        </View>
      ) : resultUrl ? (
        <>
          <Image source={{ uri: resultUrl }} style={styles.preview} />
          <View style={styles.row}>
            <Button title="Farklı Tarz" onPress={() => navigation.goBack()} />
            <Button title="Başa Dön" onPress={() => navigation.navigate('Upload')} />
          </View>
          <View style={{ marginTop: 8 }}>
            <Button title="Geçmişi Gör" onPress={() => navigation.navigate('History')} />
          </View>
        </>
      ) : (
        <>
          <View style={[styles.preview, styles.center]}>
            <Text>Görsel alınamadı.</Text>
          </View>
          <Button
            title="Tekrar Dene"
            onPress={() => navigation.replace('Results', { imageUri, preset })}
          />
        </>
      )}

      <Text style={styles.note}>
        Not: MOCK mod açıksa placeholder gösterebilir. Gerçek üretim için .env içinde{' '}
        <Text style={{ fontWeight: '700' }}>MOCK_MODE=false</Text> yapıp FAL giriş bilgilerini ekleyin.
      </Text>
      <Text style={{ color: '#666', marginTop: 8 }}>Mevcut kredi: {credits}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600' },
  sub: { color: '#333' },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  note: { color: '#666' },
});
