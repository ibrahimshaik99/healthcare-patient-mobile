import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Badge} from '../../components/common/Badge';
import {Avatar} from '../../components/common/Avatar';
import {Button} from '../../components/common/Button';
import {Card} from '../../components/common/Card';
import {Loader} from '../../components/common/Loader';
import {useAppointments} from '../../hooks/useAppointments';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';

type DetailRouteProp = RouteProp<AppointmentStackParamList, 'AppointmentDetail'>;
type DetailNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'AppointmentDetail'>;

export const AppointmentDetailScreen: React.FC = () => {
  const navigation = useNavigation<DetailNavProp>();
  const route = useRoute<DetailRouteProp>();
  const insets = useSafeAreaInsets();
  const {currentAppointment, getAppointments, cancel} = useAppointments();

  useEffect(() => {
    if (!currentAppointment) {
      getAppointments();
    }
  }, []);

  if (!currentAppointment) {
    return <Loader />;
  }

  const appt = currentAppointment;
  const doctorName = appt.doctor
    ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`
    : 'Doctor';
  const specialization = appt.doctor?.specializations?.[0] || 'General';

  const statusTimeline = [
    {status: 'Booked', date: appt.createdAt, completed: true},
    {status: 'Confirmed', date: appt.status === 'confirmed' ? appt.updatedAt : undefined, completed: appt.status === 'confirmed' || appt.status === 'completed'},
    {status: 'Consultation', date: appt.status === 'completed' ? appt.updatedAt : undefined, completed: appt.status === 'completed'},
    {status: 'Completed', date: appt.status === 'completed' ? appt.updatedAt : undefined, completed: appt.status === 'completed'},
  ];

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Appointment Details" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusBanner}>
          <Badge status={appt.status} size="medium" />
          <Text style={styles.appointmentId}>ID: {appt.id.slice(0, 8)}</Text>
        </View>

        <TouchableOpacity style={styles.doctorCard}>
          <Avatar source={appt.doctor?.photo} name={doctorName} size={56} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.specialization}>{specialization}</Text>
            <View style={styles.doctorRating}>
              <Icon name="star" size={14} color={Colors.accent} />
              <Text style={styles.ratingText}>
                {appt.doctor?.rating?.toFixed(1)} ({appt.doctor?.reviewCount} reviews)
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <Card style={styles.detailCard}>
          <Text style={styles.cardTitle}>Appointment Details</Text>
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{appt.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={18} color={Colors.primary} />
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{appt.startTime} - {appt.endTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name={appt.consultationType === 'online' ? 'videocam-outline' : 'business-outline'} size={18} color={Colors.primary} />
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {appt.consultationType === 'online' ? 'Online Consultation' : 'OPD Consultation'}
            </Text>
          </View>
          {appt.reason && (
            <View style={styles.detailRow}>
              <Icon name="document-text-outline" size={18} color={Colors.primary} />
              <Text style={styles.detailLabel}>Reason</Text>
              <Text style={styles.detailValue}>{appt.reason}</Text>
            </View>
          )}
        </Card>

        {appt.payment && (
          <Card style={styles.detailCard}>
            <Text style={styles.cardTitle}>Payment Info</Text>
            <View style={styles.detailRow}>
              <Icon name="wallet-outline" size={18} color={Colors.primary} />
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>₹{appt.payment.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="checkmark-circle-outline" size={18} color={Colors.primary} />
              <Text style={styles.detailLabel}>Status</Text>
              <Badge status={appt.payment.status} size="small" />
            </View>
          </Card>
        )}

        <Card style={styles.detailCard}>
          <Text style={styles.cardTitle}>Status Timeline</Text>
          {statusTimeline.map((item, index) => (
            <View key={item.status} style={styles.timelineItem}>
              <View style={styles.timelineDotContainer}>
                <View style={[styles.timelineDot, item.completed && styles.timelineDotCompleted]} />
                {index < statusTimeline.length - 1 && (
                  <View style={[styles.timelineLine, item.completed && styles.timelineLineCompleted]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineStatus, item.completed && {color: Colors.text}]}>
                  {item.status}
                </Text>
                {item.date && (
                  <Text style={styles.timelineDate}>{item.date}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>

        {appt.prescription && (
          <View style={styles.section}>
            <Button
              title="Download Prescription"
              onPress={() => {}}
              variant="outline"
              size="medium"
              icon={<Icon name="download-outline" size={18} color={Colors.primary} />}
            />
          </View>
        )}

        <View style={styles.actionSection}>
          {(appt.status === 'pending' || appt.status === 'confirmed') && (
            <Button
              title="Cancel Appointment"
              onPress={async () => {
                await cancel(appt.id);
                navigation.goBack();
              }}
              variant="outline"
              size="medium"
              style={styles.cancelButton}
            />
          )}
          {appt.status === 'confirmed' && appt.consultationType === 'online' && (
            <Button
              title="Join Video Call"
              onPress={() => {}}
              variant="primary"
              size="medium"
              icon={<Icon name="videocam" size={18} color={Colors.white} />}
            />
          )}
          {appt.status === 'completed' && (
            <Button
              title="Rate Your Experience"
              onPress={() => {}}
              variant="primary"
              size="medium"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  appointmentId: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
    marginBottom: Spacing.lg,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  doctorName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  specialization: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 4,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  detailCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  detailLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    width: 60,
  },
  detailValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  timelineDotCompleted: {
    backgroundColor: Colors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    marginLeft: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  timelineStatus: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  timelineDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  section: {
    padding: Spacing.xl,
  },
  actionSection: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
});
