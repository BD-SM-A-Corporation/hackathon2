import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, FAB, Portal, Modal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { beds, records, Bed, Record, CreateRecordRequest } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function BedDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const bedId = params.id;
  
  if (!bedId) {
    return (
      <View style={styles.container}>
        <Text>Invalid bed ID</Text>
      </View>
    );
  }

  const [visible, setVisible] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'records' | 'stats'>('records');
  const [newRecord, setNewRecord] = React.useState<Omit<CreateRecordRequest, 'bed_id'>>({
    date: new Date().toISOString(),
    height: 0,
    humidity: 0,
    notes: '',
    photo_url: '',
    visual_status: 'healthy',
  });

  const queryClient = useQueryClient();

  const { data: bed, isLoading: isBedLoading } = useQuery({
    queryKey: ['bed', bedId],
    queryFn: () => beds.getById(bedId),
  });

  const { data: recordsList, isLoading: isRecordsLoading } = useQuery({
    queryKey: ['records', bedId],
    queryFn: () => records.getByBedId(Number(bedId)),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<CreateRecordRequest, 'bed_id'>) => records.create(bedId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', bedId] });
      setVisible(false);
      setNewRecord({
        date: new Date().toISOString(),
        height: 0,
        humidity: 0,
        notes: '',
        photo_url: '',
        visual_status: 'healthy',
      });
    },
  });

  const handleCreateRecord = () => {
    if (!newRecord.date || !newRecord.height || !newRecord.humidity) {
      return;
    }
    createMutation.mutate(newRecord);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T00:00:00Z`;
      setNewRecord({ ...newRecord, date: formattedDate });
    }
  };

  const renderRecord = ({ item }: { item: Record }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{new Date(item.date).toLocaleDateString()}</Text>
        <Text variant="bodyMedium">Height: {item.height}cm</Text>
        <Text variant="bodyMedium">Humidity: {item.humidity}%</Text>
        <Text variant="bodyMedium">Status: {item.visual_status}</Text>
        <Text variant="bodyMedium">Notes: {item.notes}</Text>
      </Card.Content>
    </Card>
  );

  const renderStats = () => {
    if (!recordsList?.data || recordsList.data.length === 0) {
      return <Text style={styles.noData}>No records available</Text>;
    }

    const heightData = {
      labels: recordsList.data.map(r => new Date(r.date).toLocaleDateString()),
      datasets: [{
        data: recordsList.data.map(r => r.height),
      }],
    };

    const humidityData = {
      labels: recordsList.data.map(r => new Date(r.date).toLocaleDateString()),
      datasets: [{
        data: recordsList.data.map(r => r.humidity),
      }],
    };

    return (
      <ScrollView style={styles.statsContainer}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium">Height Growth</Text>
            <LineChart
              data={heightData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium">Humidity Levels</Text>
            <LineChart
              data={humidityData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  if (isBedLoading || isRecordsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!bed?.data) {
    return (
      <View style={styles.container}>
        <Text>Bed not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.bedCard}>
        <Card.Content>
          <Text variant="headlineMedium">{bed.data.name}</Text>
          <Text variant="bodyLarge">Plant: {bed.data.plant_type}</Text>
          <Text variant="bodyMedium">Sowing Date: {new Date(bed.data.sowing_date).toLocaleDateString()}</Text>
          <Text variant="bodyMedium">Substrate: {bed.data.substrate_type}</Text>
          <Text variant="bodyMedium">Expected Harvest: {new Date(bed.data.expected_harvest).toLocaleDateString()}</Text>
          <Text variant="bodyMedium">Status: {bed.data.status}</Text>
          <Text variant="bodyMedium">Created: {new Date(bed.data.CreatedAt).toLocaleDateString()}</Text>
          <Text variant="bodyMedium">Last Updated: {new Date(bed.data.UpdatedAt).toLocaleDateString()}</Text>
        </Card.Content>
      </Card>

      <SegmentedButtons
        value={viewMode}
        onValueChange={value => setViewMode(value as 'records' | 'stats')}
        buttons={[
          { value: 'records', label: 'Records' },
          { value: 'stats', label: 'Stats' },
        ]}
        style={styles.segmentedButtons}
      />

      {viewMode === 'records' ? (
        <FlatList
          data={recordsList?.data}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderStats()
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Add New Record</Text>
          
          <Button
            mode="outlined"
            onPress={() => setShowDate(true)}
            style={styles.input}
          >
            Date: {new Date(newRecord.date).toLocaleDateString()}
          </Button>

          <TextInput
            label="Height (cm)"
            value={newRecord.height.toString()}
            onChangeText={(text) => setNewRecord({ ...newRecord, height: parseFloat(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Humidity (%)"
            value={newRecord.humidity.toString()}
            onChangeText={(text) => setNewRecord({ ...newRecord, humidity: parseFloat(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Visual Status"
            value={newRecord.visual_status}
            onChangeText={(text) => setNewRecord({ ...newRecord, visual_status: text })}
            style={styles.input}
          />
          
          <TextInput
            label="Notes"
            value={newRecord.notes}
            onChangeText={(text) => setNewRecord({ ...newRecord, notes: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(newRecord.date)}
              mode="date"
              is24Hour={true}
              onChange={onDateChange}
            />
          )}

          <Button
            mode="contained"
            onPress={handleCreateRecord}
            loading={createMutation.isPending}
            disabled={createMutation.isPending}
            style={styles.button}
          >
            Add Record
          </Button>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bedCard: {
    margin: 16,
  },
  segmentedButtons: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  statsContainer: {
    flex: 1,
  },
  chartCard: {
    margin: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
}); 