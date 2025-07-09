import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useGymStore} from '../store/gymStore';
import {ExerciseCard} from '../components/ExerciseCard';
import {MuscleGroupCard} from '../components/MuscleGroupCard';
import {APP_SCREEN} from '../navigators/screen-type';
import TextApp from '../components/textApp';
import {navigate} from '../navigators/navigation-services';

const {width} = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const {
    exercises,
    muscleGroups,
    initializeData,
    favoriteExercises,
    workoutSessions,
  } = useGymStore();
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const hour = new Date().getHours();

    let greet = '';
    if (hour >= 5 && hour < 11) {
      greet = 'Chào buổi sáng';
    } else if (hour >= 11 && hour < 13) {
      greet = 'Chào buổi trưa';
    } else if (hour >= 13 && hour < 18) {
      greet = 'Chào buổi chiều';
    } else {
      greet = 'Chào buổi tối';
    }

    setGreeting(greet);
  }, []);

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
          <TextApp style={styles.greeting}>👋 {greeting}!</TextApp>
          <TextApp style={styles.subtitle}>Sẵn sàng tập luyện hôm nay?</TextApp>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TextApp style={styles.statNumber}>{exercises.length}</TextApp>
            <TextApp style={styles.statLabel}>Bài tập</TextApp>
          </View>
          <View style={styles.statCard}>
            <TextApp style={styles.statNumber}>
              {favoriteExercises.length}
            </TextApp>
            <TextApp style={styles.statLabel}>Yêu thích</TextApp>
          </View>
          <View style={styles.statCard}>
            <TextApp style={styles.statNumber}>
              {workoutSessions.length}
            </TextApp>
            <TextApp style={styles.statLabel}>Buổi tập</TextApp>
          </View>
        </View>

        {/* Today's Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TextApp style={styles.sectionTitle}>Gợi ý hôm nay</TextApp>
            <TouchableOpacity
              onPress={() => navigate(APP_SCREEN.EXERCISE_LIST)}>
              <TextApp style={styles.seeAllText}>Xem tất cả</TextApp>
            </TouchableOpacity>
          </View>

          {todaysSuggestions.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() =>
                navigate(APP_SCREEN.EXERCISE_DETAIL, {exerciseId: exercise.id})
              }
            />
          ))}
        </View>

        {/* Muscle Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TextApp style={styles.sectionTitle}>Nhóm cơ</TextApp>
            <TouchableOpacity
              onPress={() => navigate(APP_SCREEN.EXERCISE_LIST)}>
              <TextApp style={styles.seeAllText}>Xem tất cả</TextApp>
            </TouchableOpacity>
          </View>

          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.slice(0, 6).map(muscleGroup => (
              <MuscleGroupCard
                key={muscleGroup.id}
                muscleGroup={muscleGroup}
                exerciseCount={getMuscleGroupExerciseCount(muscleGroup.id)}
                onPress={() =>
                  navigate(APP_SCREEN.EXERCISE_LIST, {
                    muscleGroupId: muscleGroup?.id,
                  })
                }
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TextApp
            style={[
              styles.sectionTitle,
              {marginHorizontal: 24, marginBottom: 4},
            ]}>
            Thao tác nhanh
          </TextApp>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, {backgroundColor: '#4CAF50'}]}
              onPress={() => navigate(APP_SCREEN.TIMER)}>
              <TextApp style={styles.quickActionIcon}>⏱️</TextApp>
              <TextApp style={styles.quickActionText}>Hẹn giờ</TextApp>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, {backgroundColor: '#2196F3'}]}
              onPress={() => navigate(APP_SCREEN.WORKOUT_PLANS)}>
              <TextApp style={styles.quickActionIcon}>📋</TextApp>
              <TextApp style={styles.quickActionText}>Lộ trình</TextApp>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, {backgroundColor: '#FF9800'}]}
              onPress={() => navigate(APP_SCREEN.CALENDAR)}>
              <TextApp style={styles.quickActionIcon}>📅</TextApp>
              <TextApp style={styles.quickActionText}>Lịch tập</TextApp>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, {backgroundColor: '#9C27B0'}]}
              onPress={() => navigate(APP_SCREEN.PROGRESS)}>
              <TextApp style={styles.quickActionIcon}>📊</TextApp>
              <TextApp style={styles.quickActionText}>Tiến trình</TextApp>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions */}
        {/* {recentSessions.length > 0 && ( */}
        <View style={styles.section}>
          <TextApp
            style={[
              styles.sectionTitle,
              {marginHorizontal: 24, marginBottom: 4},
            ]}>
            Buổi tập gần đây
          </TextApp>
          {recentSessions.map(session => (
            <View key={session.id} style={styles.sessionCard}>
              <TextApp style={styles.sessionDate}>
                {new Date(session.date).toLocaleDateString('vi-VN')}
              </TextApp>
              <TextApp style={styles.sessionDuration}>
                {session.duration} phút
              </TextApp>
              <TextApp style={styles.sessionExercises}>
                {session.exercises.length} bài tập
              </TextApp>
            </View>
          ))}
        </View>
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
