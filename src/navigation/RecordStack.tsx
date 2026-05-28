import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MedicalRecordsScreen} from '../screens/records/MedicalRecordsScreen';
import {PrescriptionDetailScreen} from '../screens/records/PrescriptionDetailScreen';
import {Colors} from '../constants/theme';

export type RecordStackParamList = {
  MedicalRecords: undefined;
  PrescriptionDetail: {prescriptionId: string};
};

const Stack = createNativeStackNavigator<RecordStackParamList>();

export const RecordStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
      <Stack.Screen name="PrescriptionDetail" component={PrescriptionDetailScreen} />
    </Stack.Navigator>
  );
};
