import React, {useState, useEffect} from 'react';
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
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {DatePicker} from '../../components/common/DatePicker';
import {SlotSelector} from '../../components/common/SlotSelector';
import {useAppointments} from '../../hooks/useAppointments';
import {useDoctors} from '../../hooks/useDoctors';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';
import {ConsultationType, Slot} from '../../types';

type BookingRouteProp = RouteProp<AppointmentStackParamList, 'Booking'>;
type BookingNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'Booking'>;

const STEPS = ['Type', 'Date & Time', 'Reason', 'Confirm'];

export const BookingScreen: React.FC = () => {
  const navigation = useNavigation<BookingNavProp>();
  const route = useRoute<BookingRouteProp>();
  const insets = useSafeAreaInsets();
  const {getSlots, availableSlots, isCreating, bookAppointment} = useAppointments();
  const {getDoctor, selectedDoctor} = useDoctors();

  const [currentStep, setCurrentStep] = useState(0);
  const [consultType, setConsultType] = useState<ConsultationType>('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    getDoctor(route.params.doctorId);
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, [route.params.doctorId]);

  useEffect(() => {
    if (selectedDate && (currentStep === 1 || currentStep === 2)) {
      getSlots(route.params.doctorId, selectedDate);
    }
  }, [selectedDate, currentStep]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    try {
      const appointment = await bookAppointment({
        doctorId: route.params.doctorId,
        slotId: selectedSlot.id,
        consultationType: consultType,
        date: selectedDate,
        reason,
      });

      if (appointment.payment) {
        navigation.replace('Payment', {
          appointmentId: appointment.id,
          amount: appointment.payment.amount,
        });
      } else {
        navigation.navigate('MyAppointments');
      }
    } catch {
      // Error handled by store
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={[styles.stepDot, index <= currentStep && styles.stepDotActive]}>
            <Text style={[styles.stepNumber, index <= currentStep && styles.stepNumberActive]}>
              {index + 1}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View style={[styles.stepLine, index < currentStep && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Select Consultation Type</Text>
      <View style={styles.consultCards}>
        <TouchableOpacity
          style={[styles.consultCard2, consultType === 'online' && styles.consultCardActive]}
          onPress={() => setConsultType('online')}>
          <Icon name="videocam" size={36} color={consultType === 'online' ? Colors.primary : Colors.textTertiary} />
          <Text style={[styles.consultTitle2, consultType === 'online' && styles.consultTitleActive]}>
            Online Consultation
          </Text>
          <Text style={styles.consultDesc2}>Video call with doctor</Text>
          {consultType === 'online' && (
            <Icon name="checkmark-circle" size={24} color={Colors.primary} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.consultCard2, consultType === 'opd' && styles.consultCardActive]}
          onPress={() => setConsultType('opd')}>
          <Icon name="business" size={36} color={consultType === 'opd' ? Colors.secondary : Colors.textTertiary} />
          <Text style={[styles.consultTitle2, consultType === 'opd' && {color: Colors.secondary}]}>
            OPD Consultation
          </Text>
          <Text style={styles.consultDesc2}>Visit clinic in person</Text>
          {consultType === 'opd' && (
            <Icon name="checkmark-circle" size={24} color={Colors.secondary} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
      <View style={styles.slotsWrapper}>
        <SlotSelector
          slots={availableSlots}
          selectedSlotId={selectedSlot?.id}
          onSelect={setSelectedSlot}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Reason for Visit</Text>
      <Text style={styles.stepSubtitle}>Share your symptoms or reason for consultation (optional)</Text>
      <Input
        value={reason}
        onChangeText={setReason}
        placeholder="Describe your symptoms..."
        multiline
        numberOfLines={4}
        style={styles.reasonInput}
      />
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Confirm Booking</Text>
      {selectedDoctor && (
        <View style={styles.confirmCard}>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Doctor</Text>
            <Text style={styles.confirmValue}>
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Type</Text>
            <Text style={styles.confirmValue}>
              {consultType === 'online' ? 'Online Consultation' : 'OPD Consultation'}
            </Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Date</Text>
            <Text style={styles.confirmValue}>{selectedDate}</Text>
          </View>
          {selectedSlot && (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Time</Text>
              <Text style={styles.confirmValue}>{selectedSlot.startTime}</Text>
            </View>
          )}
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Fees</Text>
            <Text style={styles.confirmValue}>
              ₹{consultType === 'online' ? selectedDoctor?.onlineFee : selectedDoctor?.consultationFee}
            </Text>
          </View>
          {reason ? (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Reason</Text>
              <Text style={styles.confirmValue}>{reason}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return true;
      case 1: return selectedSlot !== null;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const getButtonTitle = () => {
    if (currentStep === 3) {
      return 'Confirm Appointment';
    }
    return 'Continue';
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Book Appointment" showBack onBackPress={handleBack} />

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={getButtonTitle()}
          onPress={currentStep === 3 ? handleConfirm : handleNext}
          loading={isCreating}
          disabled={!canProceed()}
          variant="primary"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  stepDotActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textTertiary,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  stepTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  consultCards: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  consultCard2: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  consultCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  consultTitle2: {
    ...Typography.h4,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  consultTitleActive: {
    color: Colors.primary,
  },
  consultDesc2: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  checkIcon: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  slotsWrapper: {
    marginTop: Spacing.xl,
  },
  reasonInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  confirmCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
    marginTop: Spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  confirmLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  confirmValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.md,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
});
