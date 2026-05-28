import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DoctorSearchScreen} from '../screens/doctors/DoctorSearchScreen';
import {DoctorProfileScreen} from '../screens/doctors/DoctorProfileScreen';
import {BookingScreen} from '../screens/booking/BookingScreen';
import {PaymentScreen} from '../screens/booking/PaymentScreen';
import {Colors} from '../constants/theme';

export type DoctorStackParamList = {
  DoctorList: undefined;
  DoctorProfile: {doctorId: string};
  Booking: {doctorId: string};
  Payment: {appointmentId: string; amount: number};
};

const Stack = createNativeStackNavigator<DoctorStackParamList>();

export const DoctorStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="DoctorList" component={DoctorSearchScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};
