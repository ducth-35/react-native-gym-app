import {NativeStackScreenProps as RNStackScreenProps} from '@react-navigation/native-stack';

export enum APP_SCREEN {
  TAB_SCREEN = 'TAB_SCREEN',
  HOME = 'HOME_SCREEN',
  DISCOVER = 'DISCOVER_SCREEN',
  BOOKMARK = 'BOOKMARK_SCREEN',
  SEARCH = 'SEARCH_SCREEN',
  DETAILS = 'DETAILS_SCREEN',
}

export type RootStackParamList = {
  [APP_SCREEN.TAB_SCREEN]: undefined;
  [APP_SCREEN.HOME]: undefined;
  [APP_SCREEN.DISCOVER]: undefined;
  [APP_SCREEN.BOOKMARK]: undefined;
  [APP_SCREEN.SEARCH]: undefined;
  [APP_SCREEN.DETAILS]: undefined;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  RNStackScreenProps<RootStackParamList, T>;
