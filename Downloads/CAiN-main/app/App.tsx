// app/App.tsx
import React from 'react';
import Constants from 'expo-constants';

// ── Adapty: Expo Go'da native modül yoksa koşullu yükle ────────────────────────
let adapty: any = null;
try {
  if (Constants.appOwnership !== 'expo') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-adapty');
    adapty = mod?.adapty ?? mod;
  }
} catch {
  adapty = null;
}

/** Adapty'yi yalnızca BİR kez aktive et (Hot Reload / Fast Refresh'te güvenli) */
function activateAdaptyOnce() {
  try {
    const extra = (Constants.expoConfig?.extra ?? {}) as any;
    const APP_KEY = extra?.ADAPTY_APP_KEY as string | undefined;
    if (!APP_KEY || !adapty?.activate) return;

    if ((globalThis as any).__ADAPTY_ACTIVATED__) {
      // Dev ortamında kod yeniden yüklense bile ikinci kez çağrılmasın
      console.log('[ADAPTY] already activated, skipping');
      return;
    }
    (globalThis as any).__ADAPTY_ACTIVATED__ = true;

    // observerMode=false → Adapty satın almaları gözlemler
    adapty.activate(APP_KEY, { observerMode: false });
    console.log('[ADAPTY] activated');
  } catch (e) {
    console.warn('Adapty activate error:', e);
  }
}

// Uygulama import edilir edilmez çalışsın
activateAdaptyOnce();

// ── React Navigation ve uygulama içeriği ───────────────────────────────────────
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './src/theme';
import { View, TouchableOpacity, Text } from 'react-native';
import LanguageToggle from './src/components/LanguageToggle';
import { I18nProvider, useI18n } from './src/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import UploadScreen from './src/screens/UploadScreen';
import StyleScreen from './src/screens/StyleScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AuthScreen from './src/screens/AuthScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import LandingScreen from './src/screens/LandingScreen';
import IntroScreen from './src/screens/IntroScreen';
import SplashScreen from './src/screens/SplashScreen';

import { CreditsProvider } from './src/state/CreditsContext';
import { AuthProvider, useAuth } from './src/state/AuthContext';
import { HistoryProvider } from './src/state/HistoryContext';

import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const OuterStack = createNativeStackNavigator();

function AppNavigator() {
  const auth = useAuth();
  const { user, loading } = auth;
  const { t } = useI18n();
  const [splashReady, setSplashReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      // küçük bir splash gecikmesi
      await new Promise(res => setTimeout(res, 1200));
      setSplashReady(true);
    })();
  }, []);

  if (loading || !splashReady) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <Stack.Navigator initialRouteName={'Intro' as any}>
        <Stack.Screen name={'Intro' as any} component={IntroScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'Auth'} component={AuthScreen} options={{ title: t('nav_auth') }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName={'Upload'}>
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={({ navigation }) => ({
          title: t('nav_upload'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Upload')
              }
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
            >
              <Text style={{ color: colors.primary, fontSize: 16 }}>{t('back')}</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => auth.signOut()} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>{t('sign_out')}</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Style" component={StyleScreen} options={{ title: t('nav_style') }} />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: t('nav_results'), headerBackVisible: true }}
      />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: t('nav_history') }} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ title: t('nav_paywall') }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navTheme = {
    ...NavDefaultTheme,
    colors: {
      ...NavDefaultTheme.colors,
      background: colors.background,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
      card: colors.surfaceElevated,
    },
  } as const;

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <CreditsProvider>
            <HistoryProvider>
              <NavigationContainer theme={navTheme}>
                <View style={{ flex: 1 }}>
                  <LanguageToggle style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }} />
                  <OuterStack.Navigator
                    screenOptions={{
                      headerShadowVisible: false,
                      headerTitleStyle: { fontSize: 20, fontWeight: '700', color: colors.text },
                      headerTintColor: colors.primary,
                      headerStyle: { backgroundColor: colors.background },
                      contentStyle: { backgroundColor: colors.backgroundSecondary },
                      animation: 'slide_from_right',
                      gestureEnabled: true,
                      gestureDirection: 'horizontal',
                    }}
                  >
                    <OuterStack.Screen name="Root" component={AppNavigator} options={{ headerShown: false }} />
                  </OuterStack.Navigator>
                </View>
              </NavigationContainer>
            </HistoryProvider>
          </CreditsProvider>
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
