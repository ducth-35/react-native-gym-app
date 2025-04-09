import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {APP_SCREEN, RootStackParamList} from './screen-type';
import {TabNavigator} from './tab-navigator';
import {DetailsScreen} from '../screens/Details';

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigations: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={APP_SCREEN.TAB_SCREEN}>
        <Stack.Screen name={APP_SCREEN.TAB_SCREEN} component={TabNavigator} />
        <Stack.Screen name={APP_SCREEN.DETAILS} component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
