import {NativeStackScreenProps as RNStackScreenProps} from '@react-navigation/native-stack';

export enum APP_SCREEN {
  TAB_SCREEN = 'TAB_SCREEN',
  HOME = 'HOME_SCREEN',
  EXERCISE_LIST = 'EXERCISE_LIST_SCREEN',
  EXERCISE_DETAIL = 'EXERCISE_DETAIL_SCREEN',
  SEARCH = 'SEARCH_SCREEN',
  TIMER = 'TIMER_SCREEN',
  WORKOUT_PLANS = 'WORKOUT_PLANS_SCREEN',
  WORKOUT_PLAN_DETAIL = 'WORKOUT_PLAN_DETAIL_SCREEN',
  CREATE_WORKOUT_PLAN = 'CREATE_WORKOUT_PLAN_SCREEN',
  CALENDAR = 'CALENDAR_SCREEN',
  PROGRESS = 'PROGRESS_SCREEN',
}

export type RootStackParamList = {
  [APP_SCREEN.TAB_SCREEN]: undefined;
  [APP_SCREEN.HOME]: undefined;
  [APP_SCREEN.EXERCISE_LIST]: { muscleGroupId?: string };
  [APP_SCREEN.EXERCISE_DETAIL]: { exerciseId: string };
  [APP_SCREEN.SEARCH]: undefined;
  [APP_SCREEN.TIMER]: undefined;
  [APP_SCREEN.WORKOUT_PLANS]: undefined;
  [APP_SCREEN.WORKOUT_PLAN_DETAIL]: { planId: string };
  [APP_SCREEN.CREATE_WORKOUT_PLAN]: undefined;
  [APP_SCREEN.CALENDAR]: undefined;
  [APP_SCREEN.PROGRESS]: undefined;
};

export type TabParamList = {
  [APP_SCREEN.HOME]: undefined;
  [APP_SCREEN.EXERCISE_LIST]: { muscleGroupId?: string };
  [APP_SCREEN.SEARCH]: undefined;
  [APP_SCREEN.FAVORITES]: undefined;
  [APP_SCREEN.TIMER]: undefined;
  [APP_SCREEN.WORKOUT_PLANS]: undefined;
  [APP_SCREEN.CALENDAR]: undefined;
  [APP_SCREEN.PROGRESS]: undefined;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  RNStackScreenProps<RootStackParamList, T>;
