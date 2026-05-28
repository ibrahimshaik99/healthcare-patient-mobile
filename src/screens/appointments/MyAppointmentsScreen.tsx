import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {AppointmentCard} from '../../components/common/AppointmentCard';
import {EmptyState} from '../../components/common/EmptyState';
import {Loader} from '../../components/common/Loader';
import {useAppointments} from '../../hooks/useAppointments';
import {Appointment} from '../../types';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';

type AppointmentsNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'MyAppointments'>;

type TabType = 'upcoming' | 'completed' | 'cancelled';

export const MyAppointmentsScreen: React.FC = () => {
  const navigation = useNavigation<AppointmentsNavProp>();
  const insets = useSafeAreaInsets();
  const {appointments, isLoading, getAppointments, cancel, selectAppointment} = useAppointments();

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  useEffect(() => {
    getAppointments();
  }, []);

  const filteredAppointments = appointments.filter(a => {
    switch (activeTab) {
      case 'upcoming':
        return a.status === 'pending' || a.status === 'confirmed';
      case 'completed':
        return a.status === 'completed';
      case 'cancelled':
        return a.status === 'cancelled' || a.status === 'missed';
      default:
        return true;
    }
  });

  const handleCancel = async (appointment: Appointment) => {
    try {
      await cancel(appointment.id, 'Cancelled by patient');
      getAppointments();
    } catch {
      // Handle error
    }
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    selectAppointment(appointment);
    navigation.navigate('AppointmentDetail', {appointmentId: appointment.id});
  };

  const tabs: {key: TabType; label: string}[] = [
    {key: 'upcoming', label: 'Upcoming'},
    {key: 'completed', label: 'Completed'},
    {key: 'cancelled', label: 'Cancelled'},
  ];

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="My Appointments" />

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.cardWrapper}>
              <AppointmentCard
                appointment={item}
                onPress={() => handleAppointmentPress(item)}
                onCancel={() => handleCancel(item)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            activeTab === 'upcoming' ? (
              <EmptyState
                icon="calendar-outline"
                title="No Upcoming Appointments"
                message="Book your next appointment with a top doctor"
                actionLabel="Book Appointment"
                onAction={() => {}}
              />
            ) : activeTab === 'completed' ? (
              <EmptyState
                icon="checkmark-circle-outline"
                title="No Completed Appointments"
                message="Your completed appointments will appear here"
              />
            ) : (
              <EmptyState
                icon="close-circle-outline"
                title="No Cancelled Appointments"
                message="You have no cancelled appointments"
              />
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.xl,
  },
  listContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxxl,
  },
});
