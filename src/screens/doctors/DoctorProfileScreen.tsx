import React, {useEffect, useState} from 'react';
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
import {Avatar} from '../../components/common/Avatar';
import {Button} from '../../components/common/Button';
import {RatingStars} from '../../components/common/RatingStars';
import {DatePicker} from '../../components/common/DatePicker';
import {SlotSelector} from '../../components/common/SlotSelector';
import {Loader} from '../../components/common/Loader';
import {Badge} from '../../components/common/Badge';
import {useDoctors} from '../../hooks/useDoctors';
import {DoctorStackParamList} from '../../navigation/DoctorStack';

type DoctorProfileRouteProp = RouteProp<DoctorStackParamList, 'DoctorProfile'>;
type DoctorProfileNavProp = NativeStackNavigationProp<DoctorStackParamList, 'DoctorProfile'>;

export const DoctorProfileScreen: React.FC = () => {
  const navigation = useNavigation<DoctorProfileNavProp>();
  const route = useRoute<DoctorProfileRouteProp>();
  const insets = useSafeAreaInsets();
  const {selectedDoctor, isLoading, getDoctor, getReviews, reviews} = useDoctors();

  const [consultType, setConsultType] = useState<'online' | 'opd'>('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>();

  useEffect(() => {
    getDoctor(route.params.doctorId);
    getReviews(route.params.doctorId);
  }, [route.params.doctorId]);

  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today.toISOString().split('T')[0]);
    }
  }, []);

  if (isLoading || !selectedDoctor) {
    return <Loader />;
  }

  const doctorName = `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`;
  const specialization = selectedDoctor.specializations?.join(', ') || '';
  const consultationFee = consultType === 'online' ? selectedDoctor.onlineFee : selectedDoctor.consultationFee;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Doctor Profile" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar source={selectedDoctor.photo} name={doctorName} size={88} />
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialization}>{specialization}</Text>
          <View style={styles.ratingContainer}>
            <RatingStars rating={selectedDoctor.rating} size={16} showRating />
            <Text style={styles.reviewCount}>({selectedDoctor.reviewCount} reviews)</Text>
          </View>
          <View style={styles.badgeRow}>
            <Badge status={selectedDoctor.isAvailable ? 'active' : 'inactive'} />
            <View style={styles.experienceBadge}>
              <Icon name="briefcase-outline" size={14} color={Colors.primary} />
              <Text style={styles.experienceText}>{selectedDoctor.experience} years experience</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {selectedDoctor.about || `${doctorName} is a highly experienced ${specialization.toLowerCase()} with ${selectedDoctor.experience} years of practice.`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualifications</Text>
          {selectedDoctor.qualifications.map((q, i) => (
            <View key={i} style={styles.qualItem}>
              <Icon name="school-outline" size={18} color={Colors.primary} />
              <View style={styles.qualInfo}>
                <Text style={styles.qualDegree}>{q.degree}</Text>
                <Text style={styles.qualInst}>{q.institution} • {q.year}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation Type</Text>
          <View style={styles.consultToggle}>
            <TouchableOpacity
              style={[styles.consultOption, consultType === 'online' && styles.consultOptionActive]}
              onPress={() => setConsultType('online')}>
              <Icon name="videocam" size={22} color={consultType === 'online' ? Colors.primary : Colors.textTertiary} />
              <Text style={[styles.consultLabel, consultType === 'online' && styles.consultLabelActive]}>
                Online
              </Text>
              <Text style={styles.consultFee}>₹{selectedDoctor.onlineFee}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.consultOption, consultType === 'opd' && styles.consultOptionActive]}
              onPress={() => setConsultType('opd')}>
              <Icon name="business" size={22} color={consultType === 'opd' ? Colors.secondary : Colors.textTertiary} />
              <Text style={[styles.consultLabel, consultType === 'opd' && styles.consultLabelActive]}>
                OPD
              </Text>
              <Text style={styles.consultFee}>₹{selectedDoctor.consultationFee}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
          <View style={styles.slotsContainer}>
            <SlotSelector
              slots={[]}
              selectedSlotId={selectedSlotId}
              onSelect={slot => setSelectedSlotId(slot.id)}
            />
          </View>
        </View>

        {selectedDoctor.clinic && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinic Information</Text>
            <View style={styles.clinicCard}>
              <View style={styles.clinicHeader}>
                <Icon name="business" size={22} color={Colors.primary} />
                <Text style={styles.clinicName}>{selectedDoctor.clinic.name}</Text>
              </View>
              <View style={styles.clinicDetail}>
                <Icon name="location-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.clinicText}>{selectedDoctor.clinic.address}</Text>
              </View>
              <View style={styles.clinicDetail}>
                <Icon name="call-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.clinicText}>{selectedDoctor.clinic.phone}</Text>
              </View>
              <View style={styles.clinicDetail}>
                <Icon name="time-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.clinicText}>{selectedDoctor.clinic.timings}</Text>
              </View>
              <View style={styles.mapPreview}>
                <Icon name="map-outline" size={32} color={Colors.textTertiary} />
                <Text style={styles.mapText}>View on Map</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {reviews.slice(0, 3).map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Avatar name={`User ${review.patientId}`} size={36} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>Patient</Text>
                  <RatingStars rating={review.rating} size={12} />
                </View>
              </View>
              {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
            </View>
          ))}
          {reviews.length === 0 && (
            <Text style={styles.noReviews}>No reviews yet</Text>
          )}
        </View>

        <View style={styles.bottomActions}>
          <Text style={styles.totalFee}>
            Total: ₹{consultationFee}
          </Text>
          <Button
            title="Book Appointment"
            onPress={() => navigation.navigate('Booking', {doctorId: selectedDoctor.id})}
            variant="primary"
            size="large"
          />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.md,
  },
  doctorName: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  specialization: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  reviewCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  experienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  experienceText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
  },
  section: {
    padding: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAll: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  aboutText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  qualItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  qualInfo: {
    flex: 1,
  },
  qualDegree: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  qualInst: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  consultToggle: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  consultOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  consultOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  consultLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    flex: 1,
  },
  consultLabelActive: {
    color: Colors.primary,
  },
  consultFee: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  slotsContainer: {
    marginTop: Spacing.sm,
  },
  clinicCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  clinicName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  clinicDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  clinicText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  mapPreview: {
    height: 100,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  mapText: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  reviewItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewInfo: {},
  reviewerName: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewComment: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noReviews: {
    ...Typography.body,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  bottomActions: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  totalFee: {
    ...Typography.h3,
    color: Colors.text,
  },
});
