import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import {
  BatchesScreen,
  PhenologyScreen,
  AnalyticsScreen,
  LibraryScreen,
  NotificationsScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BatchesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="BatchesList" component={BatchesScreen} options={{ title: 'Мои грядки' }} />
  </Stack.Navigator>
);

const PhenologyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="PhenologyList" component={PhenologyScreen} options={{ title: 'Фенологический журнал' }} />
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

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
          name="Phenology"
          component={PhenologyStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="notebook" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="chart-line" size={size} color={color} />
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
          name="Notifications"
          component={NotificationsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="bell" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 