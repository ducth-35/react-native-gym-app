import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { ExerciseCard } from '../components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    exercises,
    muscleGroups,
    searchQuery,
    setSearchQuery,
    getFilteredExercises,
    initializeData,
  } = useGymStore();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const filteredExercises = getFilteredExercises().filter(exercise => {
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    const matchesEquipment = !selectedEquipment || 
      (selectedEquipment === 'none' ? exercise.equipment.length === 0 : 
       exercise.equipment.includes(selectedEquipment));
    
    return matchesDifficulty && matchesEquipment;
  });

  // Get unique equipment list
  const allEquipment = Array.from(
    new Set(exercises.flatMap(ex => ex.equipment))
  ).filter(Boolean);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSelectedDifficulty(null);
    setSelectedEquipment(null);
    setSearchQuery('');
  };

  const renderSearchSuggestions = () => {
    if (searchQuery.length > 0) return null;

    return (
      <View style={styles.suggestionsContainer}>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕒 Tìm kiếm gần đây</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Tìm kiếm phổ biến</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Hít đất', 'Squat', 'Plank', 'Kéo xà', 'Burpee'].map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularSearchItem}
                onPress={() => handleSearch(search)}
              >
                <Text style={styles.popularSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Muscle Groups Quick Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Tìm theo nhóm cơ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {muscleGroups.map((muscleGroup) => (
              <TouchableOpacity
                key={muscleGroup.id}
                style={[styles.muscleGroupItem, { backgroundColor: muscleGroup.color }]}
                onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_LIST as never, { muscleGroupId: muscleGroup.id } as never)}
              >
                <Text style={styles.muscleGroupIcon}>{muscleGroup.icon}</Text>
                <Text style={styles.muscleGroupText}>{muscleGroup.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Difficulty Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Độ khó:</Text>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty && styles.filterButtonActive
                ]}
                onPress={() => setSelectedDifficulty(
                  selectedDifficulty === difficulty ? null : difficulty
                )}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedDifficulty === difficulty && styles.filterButtonTextActive
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Equipment Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Dụng cụ:</Text>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedEquipment === 'none' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedEquipment(
                selectedEquipment === 'none' ? null : 'none'
              )}
            >
              <Text style={[
                styles.filterButtonText,
                selectedEquipment === 'none' && styles.filterButtonTextActive
              ]}>
                Không cần
              </Text>
            </TouchableOpacity>
            {allEquipment.slice(0, 3).map((equipment) => (
              <TouchableOpacity
                key={equipment}
                style={[
                  styles.filterButton,
                  selectedEquipment === equipment && styles.filterButtonActive
                ]}
                onPress={() => setSelectedEquipment(
                  selectedEquipment === equipment ? null : equipment
                )}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedEquipment === equipment && styles.filterButtonTextActive
                ]}>
                  {equipment}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Clear Filters */}
        {(selectedDifficulty || selectedEquipment || searchQuery) && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {searchQuery.length > 0 || selectedDifficulty || selectedEquipment ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {filteredExercises.length} kết quả
          </Text>
          
          {filteredExercises.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsIcon}>🔍</Text>
              <Text style={styles.noResultsText}>Không tìm thấy bài tập nào</Text>
              <Text style={styles.noResultsSubtext}>
                Thử thay đổi từ khóa hoặc bộ lọc
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseCard
                  exercise={item}
                  onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_DETAIL as never, { exerciseId: item.id } as never)}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      ) : (
        renderSearchSuggestions()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  clearFiltersButton: {
    alignSelf: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recentSearchItem: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  recentSearchText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  popularSearchItem: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  popularSearchText: {
    color: '#F57C00',
    fontSize: 14,
    fontWeight: '500',
  },
  muscleGroupItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  muscleGroupIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  muscleGroupText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
