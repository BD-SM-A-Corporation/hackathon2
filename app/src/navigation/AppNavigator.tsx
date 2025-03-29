import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import screens
import {
  BatchesScreen,
  PhenologyScreen,
  AnalyticsScreen,
  LibraryScreen,
  NotificationsScreen,
  ProfileScreen,
} from '../screens';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type ProfileStackParamList = {
  Profile: undefined;
  Analytics: undefined;
  Notifications: undefined;
};

const BatchesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="BatchesList" 
      component={BatchesScreen} 
      options={{ title: 'Мои грядки' }}
    />
    <Stack.Screen 
      name="Phenology" 
      component={PhenologyScreen} 
      options={{ title: 'Фенологический журнал' }}
    />
  </Stack.Navigator>
);

const AnalyticsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Аналитика' }} />
  </Stack.Navigator>
);

const LibraryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Библиотека' }} />
  </Stack.Navigator>
);

const NotificationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Уведомления' }} />
  </Stack.Navigator>
);

const ProfileStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: '',
          headerLeft: () => (
            <TouchableOpacity 
              style={{ marginLeft: 16, padding: 8 }}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Icon name="chart-line" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 16, padding: 8 }}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="bell" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ title: 'Аналитика' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Уведомления' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Batches"
      component={BatchesStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="sprout" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Library"
      component={LibraryStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="book-open-variant" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="account" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 