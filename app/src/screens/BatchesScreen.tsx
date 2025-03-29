import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MicrogreenBatch } from '../types';

const BatchesScreen = () => {
  const [batches, setBatches] = useState<MicrogreenBatch[]>([]);

  const renderBatchItem = ({ item }: { item: MicrogreenBatch }) => (
    <TouchableOpacity style={styles.batchItem}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchName}>{item.name}</Text>
        <Text style={styles.batchType}>{item.type}</Text>
      </View>
      <View style={styles.batchDetails}>
        <Text>Дата посева: {item.sowingDate.toLocaleDateString()}</Text>
        <Text>Субстрат: {item.substrate}</Text>
        <Text>Ожидаемый сбор: {item.expectedHarvestDate.toLocaleDateString()}</Text>
      </View>
      <View style={styles.batchStatus}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'active' ? '#4CAF50' : 
                    item.status === 'completed' ? '#2196F3' : '#F44336' }
        ]}>
          {item.status === 'active' ? 'Активная' :
           item.status === 'completed' ? 'Завершена' : 'Отменена'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={batches}
        renderItem={renderBatchItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет активных грядок</Text>
        }
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Новая грядка</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  batchItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  batchName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  batchType: {
    fontSize: 16,
    color: '#666',
  },
  batchDetails: {
    marginBottom: 8,
  },
  batchStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusText: {
    fontWeight: 'bold',
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

export default BatchesScreen; 