import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Button} from '../../components/common/Button';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';

type FailureNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'MyAppointments'>;

export const PaymentFailureScreen: React.FC = () => {
  const navigation = useNavigation<FailureNavProp>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <View style={styles.failureIcon}>
          <Icon name="close" size={48} color={Colors.white} />
        </View>

        <Text style={styles.title}>Payment Failed!</Text>
        <Text style={styles.subtitle}>
          Something went wrong with your payment. Please try again.
        </Text>

        <View style={styles.helpCard}>
          <Icon name="information-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.helpText}>
            If the amount was deducted, it will be refunded within 5-7 business days.
          </Text>
        </View>

        <View style={styles.supportRow}>
          <Icon name="headset-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.supportText}>Need help? Contact support</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Try Again"
          onPress={() => navigation.goBack()}
          variant="primary"
          size="large"
        />
        <Button
          title="View Appointments"
          onPress={() => navigation.navigate('MyAppointments')}
          variant="outline"
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
  failureIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.error,
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
    lineHeight: 24,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    alignItems: 'flex-start',
  },
  helpText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  supportText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
});
