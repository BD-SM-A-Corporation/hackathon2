import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MicrogreenBatch } from '../types';
import { getToken } from '../utils/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bedService } from '../services/bedService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  BatchesList: undefined;
  Phenology: undefined;
};

type BatchesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_VERSION = '/api/v1';
const BASE_URL = process.env.API_URL || 'http://localhost:8080';
const TOKEN_KEY = 'auth_token';

interface RecordData {
  // Define proper types based on backend expectations
}

const BatchesScreen = () => {
  const navigation = useNavigation<BatchesScreenNavigationProp>();
  const [batches, setBatches] = useState<MicrogreenBatch[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    type: '',
    substrate: '',
    sowingDate: new Date(),
    expectedHarvestDate: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Phenology')}
        >
          <Icon name="notebook" size={24} color="#4CAF50" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/beds`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }

      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить грядки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/beds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBatch),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create batch');
      }

      setIsModalVisible(false);
      fetchBatches(); // Refresh the list
      setNewBatch({ // Reset form
        name: '',
        type: '',
        substrate: '',
        sowingDate: new Date(),
        expectedHarvestDate: new Date(),
      });
    } catch (error) {
      console.error('Create error:', error);
      Alert.alert('Ошибка', 'Не удалось создать грядку');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAuthError = () => {
    AsyncStorage.removeItem('userToken');
    navigation.navigate('Auth');
    Alert.alert('Сессия истекла', 'Пожалуйста, войдите снова');
  };

  const createBedRecord = async (bedId: string, recordData: any) => {
    try {
      const response = await bedService.createBed({
        name: recordData.name,
        plant_type: recordData.type,
        sowing_date: recordData.sowingDate,
        substrate_type: recordData.substrate,
        expected_harvest: recordData.expectedHarvestDate,
      });
      Alert.alert('Успех', 'Запись создана');
      return response;
    } catch (error: any) {
      if (error?.message?.includes('Unauthorized')) {
        handleAuthError();
      } else {
        Alert.alert('Ошибка', 'Не удалось создать запись');
      }
    }
  };

  const getBedRecords = async (bedId: string) => {
    try {
      const records = await bedService.getBed(parseInt(bedId));
      return records;
    } catch (error: any) {
      if (error?.message?.includes('Unauthorized')) {
        handleAuthError();
      } else {
        Alert.alert('Ошибка', 'Не удалось загрузить записи');
      }
    }
  };

  // Example of creating a new record
  const handleAddRecord = async (bedId: string) => {
    const recordData = {
      // Add your record data here
      date: new Date(),
      notes: 'Some notes',
      // ... other record fields
    };

    await createBedRecord(bedId, recordData);
  };

  const handleApiError = (error: any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    // Handle other error types
  };

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
        refreshing={isLoading}
        onRefresh={fetchBatches}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Загрузка...' : 'Нет активных грядок'}
          </Text>
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Новая грядка</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новая грядка</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Название"
              value={newBatch.name}
              onChangeText={(text) => setNewBatch({...newBatch, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Тип"
              value={newBatch.type}
              onChangeText={(text) => setNewBatch({...newBatch, type: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Субстрат"
              value={newBatch.substrate}
              onChangeText={(text) => setNewBatch({...newBatch, substrate: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateBatch}
                disabled={isCreating}
              >
                <Text style={styles.buttonText}>
                  {isCreating ? 'Создание...' : 'Создать'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
});

export default BatchesScreen; 