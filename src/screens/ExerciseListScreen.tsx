import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useGymStore} from '../store/gymStore';
import {ExerciseCard} from '../components/ExerciseCard';
import {MuscleGroupCard} from '../components/MuscleGroupCard';
import {APP_SCREEN, RootStackParamList} from '../navigators/screen-type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {navigate} from '../navigators/navigation-services';

type ExerciseListProps = NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.EXERCISE_LIST
>;

export const ExerciseListScreen: React.FC<ExerciseListProps> = ({route}) => {
  const {muscleGroupId} = route.params || {};
  const {
    exercises,
    muscleGroups,
    searchQuery,
    selectedMuscleGroup,
    setSearchQuery,
    setSelectedMuscleGroup,
    getFilteredExercises,
    initializeData,
  } = useGymStore();

  const [showMuscleGroups, setShowMuscleGroups] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    initializeData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (muscleGroupId) {
      setSelectedMuscleGroup(muscleGroupId);
      setShowMuscleGroups(false);
    }
  }, [muscleGroupId, setSelectedMuscleGroup]);

  const filteredExercises = getFilteredExercises();

  const getMuscleGroupExerciseCount = (muscleGroupId: string) => {
    return exercises.filter(ex => ex.muscleGroup.id === muscleGroupId).length;
  };

  const handleMuscleGroupPress = (muscleGroupId: string) => {
    if (selectedMuscleGroup === muscleGroupId) {
      setSelectedMuscleGroup(null);
    } else {
      setSelectedMuscleGroup(muscleGroupId);
    }
    setShowMuscleGroups(false);
  };

  const handleClearFilter = () => {
    setSelectedMuscleGroup(null);
    setSearchQuery('');
    setShowMuscleGroups(true);
  };

  const selectedMuscleGroupData = muscleGroups.find(
    mg => mg.id === selectedMuscleGroup,
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bài tập</Text>
        {(selectedMuscleGroup || searchQuery) && (
          <TouchableOpacity
            onPress={handleClearFilter}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài tập..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowMuscleGroups(false)}
        />
      </View>

      {/* Selected Muscle Group Info */}
      {selectedMuscleGroupData && (
        <View style={styles.selectedMuscleGroupContainer}>
          <View
            style={[
              styles.selectedMuscleGroupCard,
              {backgroundColor: selectedMuscleGroupData.color},
            ]}>
            <Text style={styles.selectedMuscleGroupIcon}>
              {selectedMuscleGroupData.icon}
            </Text>
            <Text style={styles.selectedMuscleGroupName}>
              {selectedMuscleGroupData.name}
            </Text>
            <Text style={styles.selectedMuscleGroupCount}>
              {getMuscleGroupExerciseCount(selectedMuscleGroupData.id)} bài tập
            </Text>
          </View>
        </View>
      )}

      {/* Muscle Groups Grid */}
      {showMuscleGroups && !searchQuery && (
        <ScrollView
          style={styles.muscleGroupsSection}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Chọn nhóm cơ</Text>
          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.map(muscleGroup => (
              <MuscleGroupCard
                key={muscleGroup.id}
                muscleGroup={muscleGroup}
                exerciseCount={getMuscleGroupExerciseCount(muscleGroup.id)}
                onPress={() => handleMuscleGroupPress(muscleGroup.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Exercises List */}
      {(!showMuscleGroups || searchQuery || selectedMuscleGroup) && (
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            {filteredExercises.length} bài tập
            {selectedMuscleGroupData && ` - ${selectedMuscleGroupData.name}`}
          </Text>

          {filteredExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy bài tập nào</Text>
              <TouchableOpacity
                onPress={handleClearFilter}
                style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Xem tất cả bài tập</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredExercises}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ExerciseCard
                  exercise={item}
                  onPress={() =>
                    navigate(APP_SCREEN.EXERCISE_DETAIL, {exerciseId: item.id})
                  }
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF6B6B']}
                  tintColor="#FF6B6B"
                />
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMuscleGroupContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectedMuscleGroupCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMuscleGroupIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  selectedMuscleGroupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  selectedMuscleGroupCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  muscleGroupsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  exercisesSection: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
