import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useAppStore } from '../lib/store';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const { setLoading } = useAppStore();
  const { isLoading } = useAuth();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a1a' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="mission" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="profile" />
      </Stack>
    </QueryClientProvider>
  );
}
