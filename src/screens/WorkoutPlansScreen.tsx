import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import {useGymStore} from '../store/gymStore';
import {WorkoutPlan} from '../types/gym.types';
import {APP_SCREEN} from '../navigators/screen-type';
import {navigate} from '../navigators/navigation-services';

const {width} = Dimensions.get('window');

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onPress: () => void;
}

const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({plan, onPress}) => {
  const scaleValue = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };
  const getGoalInfo = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return {icon: '💪', name: 'Tăng cơ', color: '#4CAF50'};
      case 'fat_loss':
        return {icon: '🔥', name: 'Giảm mỡ', color: '#FF6B6B'};
      case 'strength':
        return {icon: '🏋️', name: 'Tăng sức mạnh', color: '#FF9800'};
      default:
        return {icon: '⚖️', name: 'Duy trì', color: '#2196F3'};
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

  const goalInfo = getGoalInfo(plan.goal);
  const totalWorkouts = plan.workouts.filter(
    w => w.exercises.length > 0,
  ).length;

  const getPlanImage = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=200&fit=crop&q=80';
      case 'fat_loss':
        return 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=200&fit=crop&q=80';
      case 'strength':
        return 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=200&fit=crop&q=80';
      default:
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&q=80';
    }
  };

  return (
    <Animated.View
      style={[styles.planCard, {transform: [{scale: scaleValue}]}]}>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={{uri: getPlanImage(plan.goal)}}
          style={styles.planImage}
        />
        <View style={styles.planHeader}>
          <View style={styles.planTitleContainer}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <View style={styles.planGoal}>
              <Text style={styles.planGoalIcon}>{goalInfo.icon}</Text>
              <Text style={[styles.planGoalText, {color: goalInfo.color}]}>
                {goalInfo.name}
              </Text>
            </View>
          </View>
          <View style={styles.planDuration}>
            <Text style={styles.planDurationNumber}>{plan.duration}</Text>
            <Text style={styles.planDurationText}>ngày</Text>
          </View>
        </View>

        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.planStats}>
          <View style={styles.planStat}>
            <Text style={styles.planStatValue}>{totalWorkouts}</Text>
            <Text style={styles.planStatLabel}>Buổi tập</Text>
          </View>
          <View style={styles.planStat}>
            <Text
              style={[
                styles.planStatValue,
                {color: getDifficultyColor(plan.difficulty)},
              ]}>
              {plan.difficulty}
            </Text>
            <Text style={styles.planStatLabel}>Độ khó</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const WorkoutPlansScreen: React.FC = () => {
  const {workoutPlans, getAllWorkoutPlans, initializeData} = useGymStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const allPlans = getAllWorkoutPlans();
  const plansByGoal = allPlans.reduce((groups, plan) => {
    const goal = plan.goal;
    if (!groups[goal]) {
      groups[goal] = [];
    }
    groups[goal].push(plan);
    return groups;
  }, {} as Record<string, WorkoutPlan[]>);

  const getGoalTitle = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return '💪 Tăng cơ bắp';
      case 'fat_loss':
        return '🔥 Giảm mỡ thừa';
      case 'strength':
        return '🏋️ Tăng sức mạnh';
      default:
        return '⚖️ Duy trì sức khỏe';
    }
  };

  const handlePlanPress = (plan: WorkoutPlan) => {
    navigate(APP_SCREEN.WORKOUT_PLAN_DETAIL, {planId: plan.id});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📋 Lộ trình tập luyện</Text>
          <Text style={styles.subtitle}>
            Chọn lộ trình phù hợp với mục tiêu của bạn
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{allPlans.length}</Text>
            <Text style={styles.statLabel}>Lộ trình</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {allPlans.filter(p => p.difficulty === 'Beginner').length}
            </Text>
            <Text style={styles.statLabel}>Người mới</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {allPlans.reduce((sum, p) => sum + p.duration, 0)}
            </Text>
            <Text style={styles.statLabel}>Tổng ngày</Text>
          </View>
        </View>

        {/* Plans by Goal */}
        {Object.entries(plansByGoal).map(([goal, plans]) => (
          <View key={goal} style={styles.goalSection}>
            <Text style={styles.goalTitle}>{getGoalTitle(goal)}</Text>
            {plans.map(plan => (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                onPress={() => handlePlanPress(plan)}
              />
            ))}
          </View>
        ))}

        {/* Create Custom Plan */}
        <View style={styles.customPlanSection}>
          <Text style={styles.customPlanTitle}>✨ Tạo lộ trình riêng</Text>
          <Text style={styles.customPlanDescription}>
            Tạo lộ trình tập luyện cá nhân hóa theo nhu cầu của bạn
          </Text>
          <TouchableOpacity
            style={styles.customPlanButton}
            onPress={() => navigate(APP_SCREEN.CREATE_WORKOUT_PLAN)}>
            <Text style={styles.customPlanButtonText}>Tạo lộ trình mới</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Lời khuyên</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Chọn lộ trình phù hợp với trình độ hiện tại
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Tuân thủ lịch tập để đạt hiệu quả tốt nhất
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Nghỉ ngơi đầy đủ giữa các buổi tập
            </Text>
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
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
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
  goalSection: {
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  planImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 20,
    paddingBottom: 0,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planGoal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planGoalIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  planGoalText: {
    fontSize: 14,
    fontWeight: '600',
  },
  planDuration: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    minWidth: 60,
  },
  planDurationNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  planDurationText: {
    fontSize: 12,
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  planStat: {
    alignItems: 'center',
  },
  planStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  customPlanSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customPlanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  customPlanDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  customPlanButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  customPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
});
