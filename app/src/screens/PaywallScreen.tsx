import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useCredits } from '../state/CreditsContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation }: Props) {
  const { credits, add } = useCredits();

  const buyPack = async (amount: number) => {
    // MOCK: Burada ileride Adapty satın alma çağrısı olacak.
    await add(amount);
    Alert.alert('Başarılı', `${amount} kredi eklendi.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kredilerin Bitti</Text>
      <Text style={styles.sub}>Mevcut kredi: {credits}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Starter Paket</Text>
        <Text style={styles.cardDesc}>100 kredi • 20₺ (örnek)</Text>
        <Button title="Satın Al (Mock)" onPress={() => buyPack(100)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pro Paket</Text>
        <Text style={styles.cardDesc}>300 kredi • 50₺ (örnek)</Text>
        <Button title="Satın Al (Mock)" onPress={() => buyPack(300)} />
      </View>

      <Text style={styles.note}>Not: Bu ekran demo amaçlıdır. Gerçek ödemeler Adapty ile bağlanacaktır.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { color: '#333' },
  card: { padding: 16, borderRadius: 12, backgroundColor: '#f6f6f6', gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDesc: { color: '#555' },
  note: { color: '#666' },
});
