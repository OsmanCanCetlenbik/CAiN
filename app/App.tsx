import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UploadScreen from './src/screens/UploadScreen';
import StyleScreen from './src/screens/StyleScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import PaywallScreen from './src/screens/PaywallScreen';

import { CreditsProvider } from './src/state/CreditsContext';

export type RootStackParamList = {
  Upload: undefined;
  Style: { imageUri: string };
  Results: { imageUri: string; preset: string; resultUrl?: string };
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CreditsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Upload">
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
            name="Paywall"
            component={PaywallScreen}
            options={{ title: 'Kredi Paketleri' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CreditsProvider>
  );
}
