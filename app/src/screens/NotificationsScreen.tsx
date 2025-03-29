import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'tip';
  isEnabled: boolean;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Полив',
      message: 'Время полить вашу микрозелень',
      type: 'reminder',
      isEnabled: true,
    },
    {
      id: '2',
      title: 'Проверка состояния',
      message: 'Оцените состояние вашей микрозелени',
      type: 'reminder',
      isEnabled: true,
    },
    {
      id: '3',
      title: 'Совет по выращиванию',
      message: 'Для предотвращения плесени обеспечьте хорошую вентиляцию',
      type: 'tip',
      isEnabled: true,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, isEnabled: !notification.isEnabled }
        : notification
    ));
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Switch
        value={item.isEnabled}
        onValueChange={() => toggleNotification(item.id)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={item.isEnabled ? '#4CAF50' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Напоминания</Text>
        <FlatList
          data={notifications.filter(n => n.type === 'reminder')}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Нет активных напоминаний</Text>
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Советы по выращиванию</Text>
        <FlatList
          data={notifications.filter(n => n.type === 'tip')}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Нет активных советов</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationContent: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationsScreen; 