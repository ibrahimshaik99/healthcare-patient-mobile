import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Button} from '../../components/common/Button';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';

type SuccessRouteProp = RouteProp<AppointmentStackParamList, 'Payment'>;
type SuccessNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'MyAppointments'>;

export const PaymentSuccessScreen: React.FC = () => {
  const navigation = useNavigation<SuccessNavProp>();
  const route = useRoute<SuccessRouteProp>();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 10,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.successIcon,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}>
          <Icon name="checkmark" size={48} color={Colors.white} />
        </Animated.View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your appointment has been confirmed</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid</Text>
            <Text style={styles.detailValue}>₹{route.params?.amount || 0}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <View style={styles.successBadge}>
              <Icon name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.successText}>Success</Text>
            </View>
          </View>
        </View>

        <Icon name="receipt-outline" size={48} color={Colors.textTertiary} style={styles.receiptIcon} />
        <Text style={styles.receiptText}>Receipt has been sent to your email</Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="View Appointment"
          onPress={() => navigation.navigate('MyAppointments')}
          variant="primary"
          size="large"
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('MyAppointments')}
          variant="ghost"
          size="medium"
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.sm,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.h4,
    color: Colors.text,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  successText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  receiptIcon: {
    marginBottom: Spacing.sm,
  },
  receiptText: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
});
