import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { useAuth } from '../state/AuthContext';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CAiN’e Hoş Geldin</Text>
      <Text style={styles.sub}>Hızlı başlamak için isim ve/veya e-posta gir.</Text>

      <TextInput
        placeholder="İsim (opsiyonel)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="E-posta (opsiyonel)"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Button title="Devam Et" onPress={() => signIn({ name, email })} />

      <Text style={styles.note}>
        Not: Şimdilik girişler cihazında saklanır (Misafir modu). İstediğin zaman çıkış yapabilirsin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { color: '#444' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  note: { color: '#666', marginTop: 12 },
});
