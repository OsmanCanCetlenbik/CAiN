import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Style'>;

const PRESETS = [
  { key: 'christmas_table', label: 'Noel Masası' },
  { key: 'beach_cafe', label: 'Sahil Kafe' },
  { key: 'minimal_office', label: 'Minimal Ofis' },
];

export default function StyleScreen({ route, navigation }: Props) {
  const { imageUri } = route.params;

  const choosePreset = (preset: string) => {
    navigation.navigate('Results', { imageUri, preset });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir tarz seç</Text>
      <View style={styles.buttons}>
        {PRESETS.map(p => (
          <View key={p.key} style={styles.buttonWrap}>
            <Button title={p.label} onPress={() => choosePreset(p.key)} />
          </View>
        ))}
      </View>
      <Text style={styles.hint}>Seçtiğin tarza göre CAiN görsel üretecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600' },
  buttons: { gap: 12 },
  buttonWrap: { },
  hint: { color: '#666' },
});
