import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

export default function UploadScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);

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
    <View style={styles.container}>
      <Text style={styles.title}>Ürün Fotoğrafını Yükle</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <View style={[styles.preview, styles.placeholder]}>
          <Text>Henüz görsel seçilmedi</Text>
        </View>
      )}

      <View style={styles.row}>
        <Button title="Fotoğraf Seç" onPress={pickImage} />
        <Button title="Devam ➜" onPress={goNext} />
      </View>
      <View style={{ marginTop: 8 }}>
  <Button title="Geçmişi Gör" onPress={() => navigation.navigate('History')} />
</View>
      <Text style={styles.hint}>
        İpucu: Ürün tek başına ve kontrastlı bir arka planda olursa sonuçlar
        daha iyi olur.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600' },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  hint: { color: '#666' },
});
