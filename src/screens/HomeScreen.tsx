import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { ExerciseCard } from '../components/ExerciseCard';
import { MuscleGroupCard } from '../components/MuscleGroupCard';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { 
    exercises, 
    muscleGroups, 
    initializeData,
    favoriteExercises,
    workoutSessions 
  } = useGymStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Get today's suggested exercises (random selection)
  const getTodaysSuggestions = () => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Get muscle group exercise count
  const getMuscleGroupExerciseCount = (muscleGroupId: string) => {
    return exercises.filter(ex => ex.muscleGroup.id === muscleGroupId).length;
  };

  // Get recent workout sessions
  const getRecentSessions = () => {
    return workoutSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const todaysSuggestions = getTodaysSuggestions();
  const recentSessions = getRecentSessions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Chào bạn! 👋</Text>
          <Text style={styles.subtitle}>Sẵn sàng tập luyện hôm nay?</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{exercises.length}</Text>
            <Text style={styles.statLabel}>Bài tập</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoriteExercises.length}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{workoutSessions.length}</Text>
            <Text style={styles.statLabel}>Buổi tập</Text>
          </View>
        </View>

        {/* Today's Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💡 Gợi ý hôm nay</Text>
            <TouchableOpacity onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_LIST as never)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {todaysSuggestions.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_DETAIL as never, { exerciseId: exercise.id } as never)}
            />
          ))}
        </View>

        {/* Muscle Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Nhóm cơ</Text>
            <TouchableOpacity onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_LIST as never)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.slice(0, 6).map((muscleGroup) => (
              <MuscleGroupCard
                key={muscleGroup.id}
                muscleGroup={muscleGroup}
                exerciseCount={getMuscleGroupExerciseCount(muscleGroup.id)}
                onPress={() => navigation.navigate(APP_SCREEN.EXERCISE_LIST as never, { muscleGroupId: muscleGroup.id } as never)}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Thao tác nhanh</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => navigation.navigate(APP_SCREEN.TIMER as never)}
            >
              <Text style={styles.quickActionIcon}>⏱️</Text>
              <Text style={styles.quickActionText}>Hẹn giờ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
              onPress={() => navigation.navigate(APP_SCREEN.WORKOUT_PLANS as never)}
            >
              <Text style={styles.quickActionIcon}>📋</Text>
              <Text style={styles.quickActionText}>Lộ trình</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#FF9800' }]}
              onPress={() => navigation.navigate(APP_SCREEN.CALENDAR as never)}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Lịch tập</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#9C27B0' }]}
              onPress={() => navigation.navigate(APP_SCREEN.PROGRESS as never)}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Tiến trình</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Buổi tập gần đây</Text>
            {recentSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <Text style={styles.sessionDate}>
                  {new Date(session.date).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={styles.sessionDuration}>{session.duration} phút</Text>
                <Text style={styles.sessionExercises}>
                  {session.exercises.length} bài tập
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  quickActionButton: {
    width: (width - 52) / 2,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#666',
  },
  sessionExercises: {
    fontSize: 14,
    color: '#666',
  },
});
