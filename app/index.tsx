import { Redirect } from 'expo-router';
import { useAppStore } from '../lib/store';

export default function Index() {
  const user = useAppStore((s) => s.user);

  // If user is authenticated, go to tabs, else go to login
  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
