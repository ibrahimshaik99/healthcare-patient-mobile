import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MyAppointmentsScreen} from '../screens/appointments/MyAppointmentsScreen';
import {AppointmentDetailScreen} from '../screens/appointments/AppointmentDetailScreen';
import {BookingScreen} from '../screens/booking/BookingScreen';
import {PaymentScreen} from '../screens/booking/PaymentScreen';
import {Colors} from '../constants/theme';

export type AppointmentStackParamList = {
  MyAppointments: undefined;
  AppointmentDetail: {appointmentId: string};
  Booking: {doctorId: string};
  Payment: {appointmentId: string; amount: number};
};

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

export const AppointmentStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};
