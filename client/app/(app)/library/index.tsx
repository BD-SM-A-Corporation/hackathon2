import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Portal, Modal } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { plants } from '../../services/api';
import { Plant } from '../../services/api';

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlant, setSelectedPlant] = React.useState<Plant | null>(null);

  const { data: plantsList, isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: plants.getAll,
  });

  const filteredPlants = plantsList?.data.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlant = ({ item }: { item: Plant }) => (
    <Card
      style={styles.card}
      onPress={() => setSelectedPlant(item)}
    >
      <Card.Content>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium" numberOfLines={2}>
          {item.description}
        </Text>
        <Text variant="bodySmall">
          Growing Time: {item.growingTime} days
        </Text>
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

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search plants"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredPlants}
        renderItem={renderPlant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Modal
          visible={!!selectedPlant}
          onDismiss={() => setSelectedPlant(null)}
          contentContainerStyle={styles.modal}
        >
          {selectedPlant && (
            <>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                {selectedPlant.name}
              </Text>
              <Text variant="bodyLarge" style={styles.modalDescription}>
                {selectedPlant.description}
              </Text>
              <View style={styles.modalDetails}>
                <Text variant="bodyMedium">
                  Growing Time: {selectedPlant.growingTime} days
                </Text>
                <Text variant="bodyMedium">
                  Temperature Range: {selectedPlant.temperature.min}°C - {selectedPlant.temperature.max}°C
                </Text>
                <Text variant="bodyMedium">
                  Moisture Range: {selectedPlant.moisture.min}% - {selectedPlant.moisture.max}%
                </Text>
              </View>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    marginBottom: 16,
  },
  modalDetails: {
    gap: 8,
  },
}); 