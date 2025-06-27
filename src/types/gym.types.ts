export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
  instructions: string[];
  sets: number;
  reps: string;
  restTime: number; // seconds
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  image: string;
  video?: string;
  tips: string[];
  commonMistakes: string[];
  breathingTechnique: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'strength';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  workouts: DailyWorkout[];
}

export interface DailyWorkout {
  day: number;
  name: string;
  exercises: WorkoutExercise[];
  estimatedTime: number; // minutes
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restTime: number;
  weight?: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  planId?: string;
  exercises: CompletedExercise[];
  duration: number; // minutes
  notes: string;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface UserProgress {
  date: string;
  weight?: number;
  bodyFat?: number;
  notes: string;
  photos?: string[];
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  type: 'rest' | 'exercise' | 'custom';
}

export interface CalendarWorkout {
  date: string;
  planId?: string;
  exercises: string[];
  completed: boolean;
  notes?: string;
}
