import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MicrogreenType } from '../types';

const LibraryScreen = () => {
  const [selectedType, setSelectedType] = useState<MicrogreenType | null>(null);

  const microgreenTypes: MicrogreenType[] = [
    {
      id: '1',
      name: 'Руккола',
      description: 'Пряная зелень с острым вкусом',
      growingTime: 14,
      optimalTemperature: {
        min: 18,
        max: 24,
      },
      optimalHumidity: {
        min: 60,
        max: 80,
      },
      lightRequirements: 'Среднее освещение',
    },
    {
      id: '2',
      name: 'Кресс-салат',
      description: 'Острый вкус, богат витаминами',
      growingTime: 12,
      optimalTemperature: {
        min: 16,
        max: 22,
      },
      optimalHumidity: {
        min: 65,
        max: 85,
      },
      lightRequirements: 'Хорошее освещение',
    },
    // Add more types as needed
  ];

  const renderTypeItem = ({ item }: { item: MicrogreenType }) => (
    <TouchableOpacity
      style={styles.typeItem}
      onPress={() => setSelectedType(item)}
    >
      <Text style={styles.typeName}>{item.name}</Text>
      <Text style={styles.typeDescription}>{item.description}</Text>
      <View style={styles.typeDetails}>
        <Text>Срок выращивания: {item.growingTime} дней</Text>
        <Text>Температура: {item.optimalTemperature.min}°C - {item.optimalTemperature.max}°C</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTypeDetails = () => {
    if (!selectedType) return null;

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>{selectedType.name}</Text>
        <ScrollView style={styles.detailsScroll}>
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Описание</Text>
            <Text style={styles.detailText}>{selectedType.description}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Условия выращивания</Text>
            <Text style={styles.detailText}>
              • Срок выращивания: {selectedType.growingTime} дней{'\n'}
              • Оптимальная температура: {selectedType.optimalTemperature.min}°C - {selectedType.optimalTemperature.max}°C{'\n'}
              • Влажность: {selectedType.optimalHumidity.min}% - {selectedType.optimalHumidity.max}%{'\n'}
              • Освещение: {selectedType.lightRequirements}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={microgreenTypes}
        renderItem={renderTypeItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      {renderTypeDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  typeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  typeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  typeDetails: {
    marginTop: 8,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default LibraryScreen; 