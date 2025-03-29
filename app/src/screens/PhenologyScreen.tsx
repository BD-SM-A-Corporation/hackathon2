import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { PhenologyEntry } from '../types';

const PhenologyScreen = () => {
  const [entries, setEntries] = useState<PhenologyEntry[]>([]);

  const renderEntryItem = ({ item }: { item: PhenologyEntry }) => (
    <TouchableOpacity style={styles.entryItem}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>
          {item.date.toLocaleDateString()}
        </Text>
        <Text style={styles.entryHeight}>
          Высота: {item.height} см
        </Text>
      </View>
      
      {item.photos.length > 0 && (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: item.photos[0] }}
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

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderEntryItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет записей в журнале</Text>
        }
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Новая запись</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhenologyScreen; 