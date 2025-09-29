import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UploadScreen from './src/screens/UploadScreen';
import StyleScreen from './src/screens/StyleScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import AuthScreen from './src/screens/AuthScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import { CreditsProvider } from './src/state/CreditsContext';
import { AuthProvider, useAuth } from './src/state/AuthContext';
import { HistoryProvider } from './src/state/HistoryContext';

import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // burada istersen splash gösterebilirsin
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'Upload' : 'Auth'}>
      {!user ? (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Giriş' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{ title: 'CAiN – Ürün Yükle' }}
          />
          <Stack.Screen
            name="Style"
            component={StyleScreen}
            options={{ title: 'Tarz Seç' }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{ title: 'Sonuç' }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'Geçmiş' }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{ title: 'Kredi Paketleri' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CreditsProvider>
        <HistoryProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </HistoryProvider>
      </CreditsProvider>
    </AuthProvider>
  );
}
