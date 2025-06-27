import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_SCREEN } from '../navigators/screen-type';
import { WorkoutPlan, DailyWorkout } from '../types/gym.types';

export const WorkoutPlanDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { planId } = (route.params as any) || {};
  
  const { workoutPlans, exercises, initializeData, addCalendarWorkout } = useGymStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const plan = workoutPlans.find(p => p.id === planId);

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy lộ trình</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getGoalInfo = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return { icon: '💪', name: 'Tăng cơ', color: '#4CAF50' };
      case 'fat_loss':
        return { icon: '🔥', name: 'Giảm mỡ', color: '#FF6B6B' };
      case 'strength':
        return { icon: '🏋️', name: 'Tăng sức mạnh', color: '#FF9800' };
      default:
        return { icon: '⚖️', name: 'Duy trì', color: '#2196F3' };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Bài tập không xác định';
  };

  const handleStartPlan = () => {
    Alert.alert(
      'Bắt đầu lộ trình',
      `Bạn có muốn bắt đầu lộ trình "${plan.name}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Bắt đầu', 
          onPress: () => {
            // Add first day to calendar
            const today = new Date().toISOString().split('T')[0];
            const firstWorkout = plan.workouts.find(w => w.exercises.length > 0);
            
            if (firstWorkout) {
              addCalendarWorkout({
                date: today,
                planId: plan.id,
                exercises: firstWorkout.exercises.map(ex => ex.exerciseId),
                completed: false,
                notes: `Bắt đầu lộ trình: ${plan.name}`,
              });
              
              Alert.alert('Thành công', 'Đã thêm lộ trình vào lịch tập!');
              navigation.navigate(APP_SCREEN.CALENDAR as never);
            }
          }
        },
      ]
    );
  };

  const goalInfo = getGoalInfo(plan.goal);
  const totalWorkouts = plan.workouts.filter(w => w.exercises.length > 0).length;

  const renderDayWorkout = (workout: DailyWorkout) => (
    <View key={workout.day} style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{workout.name}</Text>
        <View style={styles.dayInfo}>
          <Text style={styles.dayNumber}>Ngày {workout.day}</Text>
          {workout.estimatedTime > 0 && (
            <Text style={styles.dayTime}>{workout.estimatedTime} phút</Text>
          )}
        </View>
      </View>

      {workout.exercises.length === 0 ? (
        <Text style={styles.restDay}>🛌 Ngày nghỉ ngơi</Text>
      ) : (
        <View style={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>
                {getExerciseName(exercise.exerciseId)}
              </Text>
              <Text style={styles.exerciseDetails}>
                {exercise.sets} sets × {exercise.reps} reps
              </Text>
              <Text style={styles.exerciseRest}>
                Nghỉ: {exercise.restTime}s
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{plan.name}</Text>
          <View style={styles.goalContainer}>
            <Text style={styles.goalIcon}>{goalInfo.icon}</Text>
            <Text style={[styles.goalText, { color: goalInfo.color }]}>
              {goalInfo.name}
            </Text>
          </View>
        </View>

        {/* Plan Info */}
        <View style={styles.infoSection}>
          <Text style={styles.description}>{plan.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{plan.duration}</Text>
              <Text style={styles.statLabel}>Ngày</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Buổi tập</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: getDifficultyColor(plan.difficulty) }
              ]}>
                {plan.difficulty}
              </Text>
              <Text style={styles.statLabel}>Độ khó</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartPlan}>
            <Text style={styles.startButtonText}>🚀 Bắt đầu lộ trình</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Workouts */}
        <View style={styles.workoutsSection}>
          <Text style={styles.sectionTitle}>📅 Lịch tập chi tiết</Text>
          {plan.workouts.map(renderDayWorkout)}
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Lời khuyên</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Tuân thủ nghiêm ngặt lịch tập</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Nghỉ ngơi đầy đủ giữa các set</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Tăng cường độ dần dần theo thời gian</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Chú ý đến kỹ thuật thực hiện</Text>
          </View>
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
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  dayInfo: {
    alignItems: 'flex-end',
  },
  dayNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  dayTime: {
    fontSize: 12,
    color: '#999',
  },
  restDay: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  exerciseRest: {
    fontSize: 12,
    color: '#999',
  },
  tipsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
