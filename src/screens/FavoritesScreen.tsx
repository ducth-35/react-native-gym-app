import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { ExerciseCard } from '../components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { exercises, favoriteExercises, initializeData } = useGymStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const favoriteExercisesList = exercises.filter(exercise => 
    favoriteExercises.includes(exercise.id)
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>Chưa có bài tập yêu thích</Text>
      <Text style={styles.emptyDescription}>
        Hãy thêm các bài tập yêu thích bằng cách nhấn vào biểu tượng trái tim ❤️ trên các bài tập
      </Text>
      <View style={styles.emptyActions}>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_LIST as never)}
        >
          <Text style={styles.exploreButtonText}>🔍 Khám phá bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate(APP_SCREEN.SEARCH as never)}
        >
          <Text style={styles.searchButtonText}>🔎 Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>❤️ Yêu thích</Text>
      <Text style={styles.subtitle}>
        {favoriteExercisesList.length} bài tập được yêu thích
      </Text>
    </View>
  );

  const renderExercisesByMuscleGroup = () => {
    // Group exercises by muscle group
    const groupedExercises = favoriteExercisesList.reduce((groups, exercise) => {
      const muscleGroupName = exercise.muscleGroup.name;
      if (!groups[muscleGroupName]) {
        groups[muscleGroupName] = [];
      }
      groups[muscleGroupName].push(exercise);
      return groups;
    }, {} as Record<string, typeof favoriteExercisesList>);

    return Object.entries(groupedExercises).map(([muscleGroupName, exercises]) => (
      <View key={muscleGroupName} style={styles.muscleGroupSection}>
        <Text style={styles.muscleGroupTitle}>
          {exercises[0].muscleGroup.icon} {muscleGroupName}
        </Text>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_DETAIL as never, { exerciseId: exercise.id } as never)}
          />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {favoriteExercisesList.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}
          
          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                // TODO: Create workout from favorites
                console.log('Create workout from favorites');
              }}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Tạo lộ trình từ yêu thích</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                // TODO: Start random workout from favorites
                const randomExercise = favoriteExercisesList[
                  Math.floor(Math.random() * favoriteExercisesList.length)
                ];
                navigation.navigate(APP_SCREEN.EXERCISE_DETAIL as never, { exerciseId: randomExercise.id } as never);
              }}
            >
              <Text style={styles.quickActionIcon}>🎲</Text>
              <Text style={styles.quickActionText}>Bài tập ngẫu nhiên</Text>
            </TouchableOpacity>
          </View>

          {/* Exercises grouped by muscle group */}
          {renderExercisesByMuscleGroup()}
        </ScrollView>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  muscleGroupSection: {
    marginBottom: 24,
  },
  muscleGroupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  exploreButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
