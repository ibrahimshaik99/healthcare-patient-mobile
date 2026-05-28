import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {format, parseISO} from 'date-fns';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Appointment} from '../../types';
import {Badge} from './Badge';
import {Avatar} from './Avatar';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onJoinCall?: () => void;
  onRate?: () => void;
  onDownloadPrescription?: () => void;
  showActions?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onCancel,
  onReschedule,
  onJoinCall,
  onRate,
  onDownloadPrescription,
  showActions = true,
}) => {
  const doctorName = appointment.doctor
    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
    : 'Doctor';

  const specialization = appointment.doctor?.specializations?.[0] || 'General';
  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';
  const canJoin = appointment.status === 'confirmed' && appointment.consultationType === 'online';
  const canRate = appointment.status === 'completed';
  const hasPrescription = !!appointment.prescription;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <Avatar
            source={appointment.doctor?.photo}
            name={doctorName}
            size={48}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName} numberOfLines={1}>{doctorName}</Text>
            <Text style={styles.specialization}>{specialization}</Text>
          </View>
        </View>
        <Badge status={appointment.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="time-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon
            name={appointment.consultationType === 'online' ? 'videocam-outline' : 'location-outline'}
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.detailText}>
            {appointment.consultationType === 'online' ? 'Online Consultation' : 'OPD Consultation'}
          </Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          {canCancel && (
            <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
              <Icon name="close-circle-outline" size={18} color={Colors.error} />
              <Text style={[styles.actionText, {color: Colors.error}]}>Cancel</Text>
            </TouchableOpacity>
          )}
          {canReschedule && (
            <TouchableOpacity style={styles.actionButton} onPress={onReschedule}>
              <Icon name="calendar-outline" size={18} color={Colors.primary} />
              <Text style={[styles.actionText, {color: Colors.primary}]}>Reschedule</Text>
            </TouchableOpacity>
          )}
          {canJoin && (
            <TouchableOpacity style={styles.actionButton} onPress={onJoinCall}>
              <Icon name="videocam" size={18} color={Colors.secondary} />
              <Text style={[styles.actionText, {color: Colors.secondary}]}>Join Call</Text>
            </TouchableOpacity>
          )}
          {canRate && (
            <TouchableOpacity style={styles.actionButton} onPress={onRate}>
              <Icon name="star-outline" size={18} color={Colors.accent} />
              <Text style={[styles.actionText, {color: Colors.accent}]}>Rate</Text>
            </TouchableOpacity>
          )}
          {hasPrescription && (
            <TouchableOpacity style={styles.actionButton} onPress={onDownloadPrescription}>
              <Icon name="document-text-outline" size={18} color={Colors.primary} />
              <Text style={[styles.actionText, {color: Colors.primary}]}>Prescription</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const canReschedule = true;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorDetails: {
    marginLeft: Spacing.md,
    flex: 1,
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
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.borderLight,
    gap: Spacing.xs,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
