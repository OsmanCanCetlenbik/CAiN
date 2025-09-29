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
import type { RootStackParamList } from '../../App';
import { generateImage } from '../services/falService';
import { useCredits } from '../state/CreditsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { imageUri, preset } = route.params;
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { credits, loading: creditsLoading, consume } = useCredits();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (creditsLoading) return; // krediler yüklenmeden bekle

      // 1) Kredi düşür
      const ok = await consume(1);
      if (!ok) {
        navigation.replace('Paywall'); // kredi yoksa Paywall’a yönlendir
        return;
      }

      // 2) Görsel üret
      setLoading(true);
      const res = await generateImage({ imageUri, preset });
      if (cancelled) return;

      if (res.ok && res.url) {
        setResultUrl(res.url);
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
        </>
      ) : (
        <>
          <View style={[styles.preview, styles.center]}>
            <Text>Görsel alınamadı.</Text>
          </View>
          <Button
            title="Tekrar Dene"
            onPress={() =>
              navigation.replace('Results', { imageUri, preset })
            }
          />
        </>
      )}

      <Text style={styles.note}>
        Not: Bu ekran şu an MOCK modda placeholder gösterebilir. Gerçek üretim
        için .env içinde MOCK_MODE=false yapıp FAL anahtar ve endpointini
        ekleyin.
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
