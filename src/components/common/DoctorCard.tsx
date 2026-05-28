import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Doctor} from '../../types';
import {Avatar} from './Avatar';
import {RatingStars} from './RatingStars';

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
  horizontal?: boolean;
  showFees?: boolean;
  showDistance?: boolean;
  distance?: number;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onPress,
  horizontal = false,
  showFees = true,
  showDistance = false,
  distance,
}) => {
  const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  const specialization = doctor.specializations?.join(', ') || 'General';

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.7}>
        <Avatar source={doctor.photo} name={doctorName} size={80} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.doctorName} numberOfLines={1}>{doctorName}</Text>
          <Text style={styles.specialization} numberOfLines={1}>{specialization}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={doctor.rating} size={14} />
            <Text style={styles.ratingText}>({doctor.reviewCount})</Text>
          </View>
          {showFees && (
            <Text style={styles.fees}>₹{doctor.consultationFee} <Text style={styles.feesLabel}>Consultation</Text></Text>
          )}
          {showDistance && distance !== undefined && (
            <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.verticalTop}>
        <Avatar source={doctor.photo} name={doctorName} size={60} />
        <View style={styles.verticalInfo}>
          <Text style={styles.doctorName} numberOfLines={1}>{doctorName}</Text>
          <Text style={styles.specialization} numberOfLines={1}>{specialization}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={doctor.rating} size={12} />
            <Text style={styles.ratingText}>{doctor.rating.toFixed(1)} ({doctor.reviewCount})</Text>
          </View>
        </View>
        {showFees && (
          <View style={styles.feesContainer}>
            <Text style={styles.feesAmount}>₹{doctor.consultationFee}</Text>
          </View>
        )}
      </View>
      <View style={styles.verticalBottom}>
        <View style={styles.infoChip}>
          <Icon name="briefcase-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.chipText}>{doctor.experience} yrs</Text>
        </View>
        {showDistance && distance !== undefined && (
          <View style={styles.infoChip}>
            <Icon name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.chipText}>{distance.toFixed(1)} km</Text>
          </View>
        )}
        <View style={styles.infoChip}>
          <Icon name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={[styles.chipText, {color: Colors.success}]}>
            {doctor.isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  horizontalInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  verticalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  verticalTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  verticalBottom: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.md,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  fees: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  feesLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  feesContainer: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
  },
  feesAmount: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  distance: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
