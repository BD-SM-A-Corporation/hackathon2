import { Stack } from 'expo-router';

export default function NotificationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="notificationsScreen"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
} 