import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { CalendarWorkout } from '../types/gym.types';

export const CalendarScreen: React.FC = () => {
  const {
    calendarWorkouts,
    exercises,
    addCalendarWorkout,
    updateCalendarWorkout,
    getWorkoutByDate,
  } = useGymStore();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const hasWorkout = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return calendarWorkouts.some(workout => workout.date === dateStr);
  };

  const isWorkoutCompleted = (date: Date): boolean => {
    const dateStr = formatDate(date);
    const workout = getWorkoutByDate(dateStr);
    return workout?.completed || false;
  };

  const handleDatePress = (date: Date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
    setShowWorkoutModal(true);
  };

  const handleMarkCompleted = () => {
    if (!selectedDate) return;
    
    const existingWorkout = getWorkoutByDate(selectedDate);
    if (existingWorkout) {
      updateCalendarWorkout(selectedDate, { completed: !existingWorkout.completed });
    } else {
      // Create a simple workout for today
      const newWorkout: CalendarWorkout = {
        date: selectedDate,
        exercises: [],
        completed: true,
        notes: 'Đã hoàn thành tập luyện',
      };
      addCalendarWorkout(newWorkout);
    }
    
    setShowWorkoutModal(false);
    Alert.alert('Thành công', 'Đã cập nhật trạng thái tập luyện!');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const calendarDays = generateCalendarDays();
  const selectedWorkout = selectedDate ? getWorkoutByDate(selectedDate) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📅 Lịch tập luyện</Text>
          <Text style={styles.subtitle}>Theo dõi và lên kế hoạch tập luyện</Text>
        </View>

        {/* Calendar Navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {currentMonth.toLocaleDateString('vi-VN', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Week Days Header */}
          <View style={styles.weekDaysHeader}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((date, index) => {
              const dateStr = formatDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const hasWorkoutDay = hasWorkout(date);
              const isCompleted = isWorkoutCompleted(date);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    !isCurrentMonthDay && styles.otherMonthDay,
                    isTodayDate && styles.todayDay,
                    hasWorkoutDay && styles.workoutDay,
                    isCompleted && styles.completedDay,
                  ]}
                  onPress={() => handleDatePress(date)}
                >
                  <Text style={[
                    styles.calendarDayText,
                    !isCurrentMonthDay && styles.otherMonthText,
                    isTodayDate && styles.todayText,
                    hasWorkoutDay && styles.workoutText,
                    isCompleted && styles.completedText,
                  ]}>
                    {date.getDate()}
                  </Text>
                  {hasWorkoutDay && (
                    <View style={[
                      styles.workoutIndicator,
                      isCompleted && styles.completedIndicator
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendText}>Hôm nay</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Có lịch tập</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Đã hoàn thành</Text>
          </View>
        </View>

        {/* Monthly Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Thống kê tháng này</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {calendarWorkouts.filter(w => 
                  w.date.startsWith(currentMonth.toISOString().slice(0, 7))
                ).length}
              </Text>
              <Text style={styles.statLabel}>Ngày có lịch</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {calendarWorkouts.filter(w => 
                  w.date.startsWith(currentMonth.toISOString().slice(0, 7)) && w.completed
                ).length}
              </Text>
              <Text style={styles.statLabel}>Đã hoàn thành</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Workout Modal */}
      <Modal
        visible={showWorkoutModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN')}
            </Text>
            
            {selectedWorkout ? (
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutStatus}>
                  Trạng thái: {selectedWorkout.completed ? '✅ Đã hoàn thành' : '⏳ Chưa hoàn thành'}
                </Text>
                {selectedWorkout.notes && (
                  <Text style={styles.workoutNotes}>{selectedWorkout.notes}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.noWorkoutText}>Chưa có lịch tập cho ngày này</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWorkoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.completeButton]}
                onPress={handleMarkCompleted}
              >
                <Text style={styles.completeButtonText}>
                  {selectedWorkout?.completed ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  calendar: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayDay: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  workoutDay: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  completedDay: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  otherMonthText: {
    color: '#ccc',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutText: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  workoutIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9800',
  },
  completedIndicator: {
    backgroundColor: '#4CAF50',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  statsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    minWidth: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutInfo: {
    marginBottom: 20,
  },
  workoutStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
