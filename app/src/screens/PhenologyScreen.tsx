import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Record } from '../types/models';
import { AddRecordButton } from '../components/AddRecordButton';
import { recordService } from '../services/recordService';

const PhenologyScreen = () => {
  const [entries, setEntries] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [bedId] = useState(1); // TODO: Get this from navigation params or context

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const records = await recordService.getBedRecords(bedId);
      setEntries(records);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [bedId]);

  const renderEntryItem = ({ item }: { item: Record }) => (
    <TouchableOpacity style={styles.entryItem}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.entryHeight}>
          Высота: {item.height} см
        </Text>
      </View>
      
      {item.photo_url && (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: item.photo_url }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.entryDetails}>
        <Text style={styles.humidity}>
          Влажность: {item.humidity}%
        </Text>
        <Text style={styles.notes}>
          {item.notes}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderEntryItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет записей в журнале</Text>
        }
      />
      <AddRecordButton 
        bedId={bedId} 
        onSuccess={fetchRecords}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  entryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryHeight: {
    fontSize: 16,
    color: '#666',
  },
  photoContainer: {
    marginVertical: 8,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  entryDetails: {
    marginTop: 8,
  },
  humidity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default PhenologyScreen; 