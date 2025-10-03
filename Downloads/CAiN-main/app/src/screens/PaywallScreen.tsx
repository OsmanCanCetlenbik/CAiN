// src/screens/PaywallScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius, typography } from '../theme';
import { useCredits } from '../state/CreditsContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

// ──────────────────────────────────────────────────────────────
// Adapty (Expo Go'da native modül yok → koşullu import)
let adapty: any = null;
try {
  if (Constants.appOwnership !== 'expo') {
    const moduleName = 'react-native-adapty';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(moduleName);
    adapty = mod?.adapty ?? mod;
  }
} catch {
  adapty = null;
}
// ──────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

type Product = {
  vendorProductId: string;
  title: string;
  description: string;
  price: number;
  credits: number;
  /** Adapty'nin döndürdüğü ham product (mağaza ürünü değilse yok) */
  raw?: any;
};

export default function PaywallScreen({ navigation }: Props) {
  const { credits, add } = useCredits();
  const extra = (Constants.expoConfig?.extra ?? {}) as any;
  const ADAPTY_APP_KEY = extra?.ADAPTY_APP_KEY as string | undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Mock liste (panel/mağaza yoksa)
  const mockProducts: Product[] = [
    { vendorProductId: 'starter_pack',  title: 'Starter Paket',  description: '100 kredi',                        price: 20,  credits: 100  },
    { vendorProductId: 'pro_pack',      title: 'Pro Paket',      description: '300 kredi • En çok tercih edilen', price: 50,  credits: 300  },
    { vendorProductId: 'premium_pack',  title: 'Premium Paket',  description: '1000 kredi • En iyi değer',        price: 150, credits: 1000 },
  ];

  useEffect(() => {
    console.log('[PAYWALL] mount');
    console.log('[PAYWALL] ADAPTY_APP_KEY?', !!ADAPTY_APP_KEY);
    console.log('[PAYWALL] adapty module?', !!adapty);
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    if (!ADAPTY_APP_KEY || !adapty) {
      console.log('[PAYWALL] loadProducts → MOCK (adapty yok ya da KEY yok)');
      setProducts(mockProducts);
      return;
    }
    // loadProducts içinde try bloğunun en üstüne:
console.log('[PAYWALL] getPaywall("main") çağrılıyor…');
const paywall = await adapty.getPaywall('main');
console.log('[PAYWALL] paywall alındı:', !!paywall);

// 1) Adapty paywall'ında bağlı görünen vendorProductId'ler
const idsFromPaywall = (paywall?.products || [])
  .map((p: any) => p?.vendorProductId)
  .filter(Boolean);
console.log('[PAYWALL] paywall.products vendor IDs:', idsFromPaywall);

// 2) Cihazın StoreKit’ten gördüğü ürünler
let rawProducts: any[] = [];
if (typeof adapty.getPaywallProducts === 'function') {
  rawProducts = await adapty.getPaywallProducts(paywall);
} else if (typeof adapty.getProducts === 'function') {
  rawProducts = await adapty.getProducts(paywall);
}
console.log('[PAYWALL] StoreKit products length:', rawProducts?.length);
console.log('[PAYWALL] StoreKit products vendor IDs:',
  (rawProducts || []).map((p: any) => p?.vendorProductId)
);

    try {
      setLoading(true);
      console.log('[PAYWALL] getPaywall("main") çağrılıyor…');
      const paywall = await adapty.getPaywall('main');
      console.log('[PAYWALL] paywall alındı:', !!paywall);

      let rawProducts: any[] = [];
      if (typeof adapty.getPaywallProducts === 'function') {
        rawProducts = await adapty.getPaywallProducts(paywall);
      } else if (typeof adapty.getProducts === 'function') {
        rawProducts = await adapty.getProducts(paywall);
      }
      console.log('[PAYWALL] ürün sayısı:', rawProducts?.length ?? 0);

      const mapped: Product[] = (rawProducts ?? []).map((p: any) => ({
        vendorProductId: String(p?.vendorProductId ?? ''),
        title: String(p?.localizedTitle ?? p?.title ?? p?.vendorProductId ?? ''),
        description: String(p?.localizedDescription ?? p?.description ?? ''),
        price: Number(p?.price?.amount ?? p?.price ?? 0),
        credits: getCreditsFromProductId(String(p?.vendorProductId ?? '')),
        raw: p,
      }));

      if (mapped.length === 0) {
        console.log('[PAYWALL] panel boş → MOCK listeye düşüyoruz');
        setProducts(mockProducts);
      } else {
        setProducts(mapped);
      }
    } catch (e) {
      console.warn('[PAYWALL] ürün yükleme hatası → MOCK’a düşüyoruz:', e);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const getCreditsFromProductId = (id: string) => {
    const map: Record<string, number> = { starter_pack: 100, pro_pack: 300, premium_pack: 1000 };
    return map[id] ?? 100;
  };

  // Bu ürün gerçek mağaza ürünü mü? (Custom Store değil mi?)
  const isPurchasable = (raw: any) => {
    const s = String(raw?.store || raw?.storeType || raw?.vendor || '').toLowerCase();
    const ok = s.includes('app') || s.includes('play') || s.includes('store');
    console.log('[PAYWALL] isPurchasable?', ok, 'storeField=', s);
    return ok;
  };

  const buyPack = async (product: Product) => {
    console.log('[PAYWALL] buyPack', product.vendorProductId, { hasRaw: !!product.raw });

    // Adapty yoksa veya ham ürün yoksa ya da mağaza ürünü değilse → MOCK
    if (!ADAPTY_APP_KEY || !adapty || !product.raw || !isPurchasable(product.raw)) {
      console.log('[PAYWALL] MOCK satın alma çalışıyor');
      await add(product.credits);
      Alert.alert('Demo', `${product.credits} kredi eklendi (mock).`);
      navigation.goBack();
      return;
    }

    try {
      setPurchasing(product.vendorProductId);

      // Varyasyon id’si varsa ekle (bazı sürümlerde şart)
      const variationId =
        product.raw?.variationId ||
        product.raw?.paywallVariationId ||
        product.raw?.paywall?.variationId;

      console.log('[PAYWALL] makePurchase çağrısı (raw + variationId?):', !!variationId);
      const result = variationId
        ? await adapty.makePurchase(product.raw, { variationId })
        : await adapty.makePurchase(product.raw);

      console.log('[PAYWALL] purchase result:', JSON.stringify(result ?? {}));

      if (result?.purchasedProduct || result?.purchase) {
        await add(product.credits);
        Alert.alert('Başarılı', `${product.credits} kredi hesabınıza eklendi.`);
        navigation.goBack();
      } else {
        Alert.alert('Hata', 'Satın alma tamamlanamadı.');
      }
    } catch (error: any) {
      console.error('[PAYWALL] Purchase error:', error);
      const msg = String(error?.message ?? '');
      const code = String(error?.code ?? '');
      // 2006/206 ve benzeri parametre hatalarında otomatik MOCK
      if (
        msg.includes('decodingFailed') ||
        msg.includes('Request params') ||
        code.includes('2006') ||
        code.includes('206')
      ) {
        console.log('[PAYWALL] Parametre/decoding hatası → MOCK’a düşüyoruz');
        await add(product.credits);
        Alert.alert('Demo', `${product.credits} kredi eklendi (mock).`);
        navigation.goBack();
        return;
      }
      if (code.toLowerCase() === 'user_cancelled') return;
      Alert.alert('Hata', error?.message || 'Satın alma tamamlanamadı.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kredilerin Bitti</Text>
      <Text style={styles.sub}>Mevcut kredi: {credits}</Text>

      <View style={styles.benefits}>
        <Text style={styles.benefit}>• 10 saniyede 4 varyant</Text>
        <Text style={styles.benefit}>• Ticari kullanım, yüksek çözünürlük</Text>
        <Text style={styles.benefit}>• LoRA ile markana özel stil</Text>
      </View>

      {products.map((p) => {
        const isHighlighted = p.vendorProductId === 'pro_pack';
        const isBusy = purchasing === p.vendorProductId;
        return (
          <View key={p.vendorProductId} style={[styles.card, isHighlighted && styles.cardHighlight]}>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.cardDesc}>
              {p.description}{p.price ? ` • ${p.price}₺` : ''}
              {isHighlighted && ' • En çok tercih edilen'}
            </Text>
            <PrimaryButton
              title={isBusy ? 'Satın Alınıyor...' : 'Satın Al'}
              onPress={() => buyPack(p)}
              disabled={isBusy}
            />
            {isBusy && <ActivityIndicator size="small" color={colors.primary} style={styles.purchasingIndicator} />}
          </View>
        );
      })}

      <Text style={styles.note}>
        Panelde mağaza ürünü yoksa bu ekran demo modda kredi ekler. iOS’ta StoreKit Testing ile gerçek popup görebilirsin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, gap: spacing.md, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.title },
  sub: { color: colors.text },
  loadingText: { marginTop: spacing.sm, color: colors.textMuted },
  benefits: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.lg, gap: 4 },
  benefit: { color: colors.text },
  card: { padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, gap: spacing.sm },
  cardHighlight: { backgroundColor: '#EEF4FF', borderWidth: 1, borderColor: '#D6E4FF' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDesc: { color: colors.textMuted },
  purchasingIndicator: { marginTop: spacing.xs },
  note: { color: colors.textMuted, textAlign: 'center', fontSize: 12 },
});
