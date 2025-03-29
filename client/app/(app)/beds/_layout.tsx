import { Stack } from 'expo-router';

export default function BedsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Beds',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Bed Details',
        }}
      />
    </Stack>
  );
} 