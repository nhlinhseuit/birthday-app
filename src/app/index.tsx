import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { checkSupabaseHealth, type HealthResult } from '@/lib/supabase';

export default function HomeScreen() {
  const [result, setResult] = useState<HealthResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function onCheck() {
    setLoading(true);
    setResult(await checkSupabaseHealth());
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Sinh Nhật Âm/Dương</Text>
      <Text style={styles.subtitle}>P0: khung dự án đã chạy.</Text>

      <Pressable style={styles.button} onPress={onCheck} disabled={loading}>
        <Text style={styles.buttonText}>Kiểm tra kết nối Supabase</Text>
      </Pressable>

      {loading && <ActivityIndicator style={styles.status} />}
      {result && !loading && (
        <Text style={[styles.status, result.ok ? styles.ok : styles.error]}>{result.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 32 },
  button: { backgroundColor: '#C2410C', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { marginTop: 20, fontSize: 15, textAlign: 'center' },
  ok: { color: '#15803D' },
  error: { color: '#B91C1C' },
});
