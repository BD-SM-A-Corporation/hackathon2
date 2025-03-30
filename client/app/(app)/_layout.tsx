import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native';

export default function AppLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: theme.colors.outline,
        headerShown: Platform.OS === 'ios' ? true : false 
      }}
    >
      <Tabs.Screen
        name="beds"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sprout" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 