import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/home/HomeScreen';
import {DoctorSearchScreen} from '../screens/doctors/DoctorSearchScreen';
import {DoctorProfileScreen} from '../screens/doctors/DoctorProfileScreen';
import {Colors} from '../constants/theme';

export type HomeStackParamList = {
  Home: undefined;
  DoctorSearch: undefined;
  DoctorProfile: {doctorId: string};
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DoctorSearch" component={DoctorSearchScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    </Stack.Navigator>
  );
};
