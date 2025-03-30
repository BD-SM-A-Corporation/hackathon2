import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '../../services/api';
import { Notification } from '../../services/api';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const queryClient = useQueryClient();

  const { data: notificationsList, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notifications.getAll,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notifications.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <Card
      style={[
        styles.card,
        !item.read && styles.unreadCard,
      ]}
    >
      <Card.Content>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationTitle}>
            <Text variant="titleMedium">{item.title}</Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          {!item.read && (
            <IconButton
              icon="check"
              size={20}
              onPress={() => handleMarkAsRead(item.id)}
            />
          )}
        </View>
        <Text variant="bodyMedium">{item.message}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const unreadCount = notificationsList?.data.filter(n => !n.read).length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Your notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => router.push('/notifications/settings' as any)}
        />
      </View>

      <FlatList
        data={notificationsList?.data}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 8,
  },
  unreadCard: {
    backgroundColor: '#e3f2fd',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    flex: 1,
  },
  timestamp: {
    color: '#666',
    marginTop: 4,
  },
}); 