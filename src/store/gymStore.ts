import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Exercise,
  MuscleGroup,
  WorkoutPlan,
  WorkoutSession,
  UserProgress,
  CalendarWorkout,
} from '../types/gym.types';

// Import data
import exercisesData from '../data/exercises.json';
import muscleGroupsData from '../data/muscleGroups.json';
import workoutPlansData from '../data/workoutPlans.json';

interface GymState {
  // Data
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
  workoutPlans: WorkoutPlan[];
  customWorkoutPlans: WorkoutPlan[];
  
  // User data
  favoriteExercises: string[];
  workoutSessions: WorkoutSession[];
  userProgress: UserProgress[];
  calendarWorkouts: CalendarWorkout[];
  
  // UI state
  selectedMuscleGroup: string | null;
  searchQuery: string;
  
  // Actions
  initializeData: () => void;
  
  // Favorites
  toggleFavorite: (exerciseId: string) => void;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  setSelectedMuscleGroup: (muscleGroupId: string | null) => void;
  getFilteredExercises: () => Exercise[];
  
  // Workout Sessions
  addWorkoutSession: (session: WorkoutSession) => void;
  updateWorkoutSession: (sessionId: string, session: Partial<WorkoutSession>) => void;
  
  // Progress
  addProgress: (progress: UserProgress) => void;
  
  // Calendar
  addCalendarWorkout: (workout: CalendarWorkout) => void;
  updateCalendarWorkout: (date: string, workout: Partial<CalendarWorkout>) => void;
  getWorkoutByDate: (date: string) => CalendarWorkout | undefined;

  // Custom Workout Plans
  addCustomWorkoutPlan: (plan: WorkoutPlan) => void;
  getAllWorkoutPlans: () => WorkoutPlan[];
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      // Initial state
      exercises: [],
      muscleGroups: [],
      workoutPlans: [],
      customWorkoutPlans: [],
      favoriteExercises: [],
      workoutSessions: [],
      userProgress: [],
      calendarWorkouts: [],
      selectedMuscleGroup: null,
      searchQuery: '',
      
      // Initialize data from JSON files
      initializeData: () => {
        set({
          exercises: exercisesData as Exercise[],
          muscleGroups: muscleGroupsData as MuscleGroup[],
          workoutPlans: workoutPlansData as WorkoutPlan[],
        });
      },
      
      // Favorites
      toggleFavorite: (exerciseId: string) => {
        const { favoriteExercises } = get();
        const isFavorite = favoriteExercises.includes(exerciseId);
        
        set({
          favoriteExercises: isFavorite
            ? favoriteExercises.filter(id => id !== exerciseId)
            : [...favoriteExercises, exerciseId],
        });
      },
      
      // Search & Filter
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
      
      setSelectedMuscleGroup: (muscleGroupId: string | null) => {
        set({ selectedMuscleGroup: muscleGroupId });
      },
      
      getFilteredExercises: () => {
        const { exercises, searchQuery, selectedMuscleGroup } = get();
        
        return exercises.filter(exercise => {
          const matchesSearch = searchQuery === '' || 
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesMuscleGroup = selectedMuscleGroup === null || 
            exercise.muscleGroup.id === selectedMuscleGroup;
          
          return matchesSearch && matchesMuscleGroup;
        });
      },
      
      // Workout Sessions
      addWorkoutSession: (session: WorkoutSession) => {
        set(state => ({
          workoutSessions: [...state.workoutSessions, session],
        }));
      },
      
      updateWorkoutSession: (sessionId: string, sessionUpdate: Partial<WorkoutSession>) => {
        set(state => ({
          workoutSessions: state.workoutSessions.map(session =>
            session.id === sessionId ? { ...session, ...sessionUpdate } : session
          ),
        }));
      },
      
      // Progress
      addProgress: (progress: UserProgress) => {
        set(state => ({
          userProgress: [...state.userProgress, progress],
        }));
      },
      
      // Calendar
      addCalendarWorkout: (workout: CalendarWorkout) => {
        set(state => ({
          calendarWorkouts: [...state.calendarWorkouts, workout],
        }));
      },
      
      updateCalendarWorkout: (date: string, workoutUpdate: Partial<CalendarWorkout>) => {
        set(state => ({
          calendarWorkouts: state.calendarWorkouts.map(workout =>
            workout.date === date ? { ...workout, ...workoutUpdate } : workout
          ),
        }));
      },
      
      getWorkoutByDate: (date: string) => {
        const { calendarWorkouts } = get();
        return calendarWorkouts.find(workout => workout.date === date);
      },

      // Custom Workout Plans
      addCustomWorkoutPlan: (plan: WorkoutPlan) => {
        set(state => ({
          customWorkoutPlans: [...state.customWorkoutPlans, plan],
        }));
      },

      getAllWorkoutPlans: () => {
        const { workoutPlans, customWorkoutPlans } = get();
        return [...workoutPlans, ...customWorkoutPlans];
      },
    }),
    {
      name: 'gym-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteExercises: state.favoriteExercises,
        workoutSessions: state.workoutSessions,
        userProgress: state.userProgress,
        calendarWorkouts: state.calendarWorkouts,
        customWorkoutPlans: state.customWorkoutPlans,
      }),
    }
  )
);
