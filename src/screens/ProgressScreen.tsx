import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useGymStore } from '../store/gymStore';
import { UserProgress } from '../types/gym.types';

export const ProgressScreen: React.FC = () => {
  const { userProgress, workoutSessions, addProgress } = useGymStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight: '',
    bodyFat: '',
    notes: '',
  });

  const handleAddProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if progress already exists for today
    const existingProgress = userProgress.find(p => p.date === today);
    if (existingProgress) {
      Alert.alert('Thông báo', 'Bạn đã ghi nhận tiến trình hôm nay rồi!');
      return;
    }

    const progress: UserProgress = {
      date: today,
      weight: newProgress.weight ? parseFloat(newProgress.weight) : undefined,
      bodyFat: newProgress.bodyFat ? parseFloat(newProgress.bodyFat) : undefined,
      notes: newProgress.notes,
    };

    addProgress(progress);
    setNewProgress({ weight: '', bodyFat: '', notes: '' });
    setShowAddModal(false);
    Alert.alert('Thành công', 'Đã ghi nhận tiến trình của bạn!');
  };

  const getRecentProgress = () => {
    return userProgress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const getWorkoutStats = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthSessions = workoutSessions.filter(
      session => new Date(session.date) >= thisMonth
    );

    const totalSessions = workoutSessions.length;
    const thisMonthCount = thisMonthSessions.length;
    const totalDuration = workoutSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    return {
      totalSessions,
      thisMonthCount,
      totalDuration,
      avgDuration,
    };
  };

  const recentProgress = getRecentProgress();
  const workoutStats = getWorkoutStats();

  const renderProgressItem = (progress: UserProgress) => (
    <View key={progress.date} style={styles.progressItem}>
      <View style={styles.progressDate}>
        <Text style={styles.progressDateText}>
          {new Date(progress.date).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      
      <View style={styles.progressData}>
        {progress.weight && (
          <View style={styles.progressDataItem}>
            <Text style={styles.progressDataLabel}>Cân nặng:</Text>
            <Text style={styles.progressDataValue}>{progress.weight} kg</Text>
          </View>
        )}
        
        {progress.bodyFat && (
          <View style={styles.progressDataItem}>
            <Text style={styles.progressDataLabel}>Tỷ lệ mỡ:</Text>
            <Text style={styles.progressDataValue}>{progress.bodyFat}%</Text>
          </View>
        )}
        
        {progress.notes && (
          <View style={styles.progressNotes}>
            <Text style={styles.progressNotesText}>{progress.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Tiến trình</Text>
          <Text style={styles.subtitle}>Theo dõi sự phát triển của bạn</Text>
        </View>

        {/* Workout Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>🏋️ Thống kê tập luyện</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats.totalSessions}</Text>
              <Text style={styles.statLabel}>Tổng buổi tập</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats.thisMonthCount}</Text>
              <Text style={styles.statLabel}>Tháng này</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{Math.round(workoutStats.totalDuration / 60)}</Text>
              <Text style={styles.statLabel}>Tổng giờ</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats.avgDuration}</Text>
              <Text style={styles.statLabel}>TB/buổi (phút)</Text>
            </View>
          </View>
        </View>

        {/* Body Progress */}
        <View style={styles.progressSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📈 Tiến trình cơ thể</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {recentProgress.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Chưa có dữ liệu tiến trình</Text>
              <Text style={styles.emptyDescription}>
                Hãy bắt đầu ghi nhận tiến trình của bạn
              </Text>
            </View>
          ) : (
            <View style={styles.progressList}>
              {recentProgress.map(renderProgressItem)}
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Thành tích</Text>
          <View style={styles.achievementsList}>
            {workoutStats.totalSessions >= 1 && (
              <View style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>🎯</Text>
                <Text style={styles.achievementText}>Buổi tập đầu tiên</Text>
              </View>
            )}
            {workoutStats.totalSessions >= 5 && (
              <View style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>💪</Text>
                <Text style={styles.achievementText}>5 buổi tập</Text>
              </View>
            )}
            {workoutStats.totalSessions >= 10 && (
              <View style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <Text style={styles.achievementText}>10 buổi tập</Text>
              </View>
            )}
            {workoutStats.thisMonthCount >= 10 && (
              <View style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>⭐</Text>
                <Text style={styles.achievementText}>Tháng năng động</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Progress Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ghi nhận tiến trình</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập cân nặng"
                value={newProgress.weight}
                onChangeText={(text) => setNewProgress(prev => ({ ...prev, weight: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tỷ lệ mỡ (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tỷ lệ mỡ"
                value={newProgress.bodyFat}
                onChangeText={(text) => setNewProgress(prev => ({ ...prev, bodyFat: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ghi chú</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Cảm nhận, mục tiêu..."
                value={newProgress.notes}
                onChangeText={(text) => setNewProgress(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddProgress}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
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
    textAlign: 'center',
  },
  progressSection: {
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
  progressList: {
    gap: 12,
  },
  progressItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  progressDate: {
    marginBottom: 8,
  },
  progressDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressData: {
    gap: 4,
  },
  progressDataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDataLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressDataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressNotes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  progressNotesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  achievementsSection: {
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
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
