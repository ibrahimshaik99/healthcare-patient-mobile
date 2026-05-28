import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Button} from '../../components/common/Button';
import {Card} from '../../components/common/Card';
import {paymentApi} from '../../services/api';
import {AppointmentStackParamList} from '../../navigation/AppointmentStack';

type PaymentRouteProp = RouteProp<AppointmentStackParamList, 'Payment'>;
type PaymentNavProp = NativeStackNavigationProp<AppointmentStackParamList, 'Payment'>;

const paymentMethods = [
  {id: 'upi', label: 'UPI', icon: 'phone-portrait-outline'},
  {id: 'card', label: 'Card', icon: 'card-outline'},
  {id: 'netbanking', label: 'Net Banking', icon: 'globe-outline'},
  {id: 'wallet', label: 'Wallet', icon: 'wallet-outline'},
];

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentNavProp>();
  const route = useRoute<PaymentRouteProp>();
  const insets = useSafeAreaInsets();

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await paymentApi.createOrder(route.params.appointmentId, route.params.amount);
      if (response.success) {
        navigation.replace('PaymentSuccess', {
          appointmentId: route.params.appointmentId,
          amount: route.params.amount,
        });
      }
    } catch {
      navigation.replace('PaymentFailure', {
        appointmentId: route.params.appointmentId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Payment" showBack />

      <View style={styles.content}>
        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amount}>₹{route.params.amount}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={styles.methodsContainer}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
              onPress={() => setSelectedMethod(method.id)}>
              <Icon
                name={method.icon}
                size={24}
                color={selectedMethod === method.id ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>
                {method.label}
              </Text>
              {selectedMethod === method.id && (
                <Icon name="checkmark-circle" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Appointment Fee</Text>
            <Text style={styles.summaryValue}>₹{route.params.amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST</Text>
            <Text style={styles.summaryValue}>Included</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{route.params.amount}</Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title={`Pay ₹${route.params.amount}`}
          onPress={handlePayment}
          loading={isProcessing}
          variant="primary"
          size="large"
        />
        <Text style={styles.secureText}>
          <Icon name="lock-closed" size={12} color={Colors.textTertiary} /> Secured by Razorpay
        </Text>
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
    padding: Spacing.xl,
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  amountLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  amount: {
    ...Typography.h1,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  methodsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  methodCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  methodLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    flex: 1,
  },
  methodLabelActive: {
    color: Colors.primary,
  },
  summaryCard: {
    padding: Spacing.lg,
  },
  summaryTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.primary,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  secureText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
