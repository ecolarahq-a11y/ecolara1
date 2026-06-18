import { useEffect } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function AuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/' || pathname === '/auth';
    const isProtectedRoute = !isAuthRoute;

    if (user && isAuthRoute) {
      router.replace('/(tabs)/home');
    } else if (!user && isProtectedRoute) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D2818', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
