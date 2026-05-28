import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {authApi} from '../../services/api';
import {AuthStackParamList} from '../../navigation/AppNavigator';

type ResetRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type ResetNavProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetNavProp>();
  const route = useRoute<ResetRouteProp>();
  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError('');

    if (!otp.trim() || otp.length < 6) {
      setError('Please enter the valid OTP');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        verificationId: route.params.verificationId,
        otp: otp.trim(),
        password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.content, {paddingTop: insets.top + Spacing.xl}]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="key-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the OTP sent to your email and set a new password
          </Text>
        </View>

        {success ? (
          <View style={styles.successContainer}>
            <Icon name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.successText}>Password Reset Successful!</Text>
            <Text style={styles.successSubtext}>Redirecting to login...</Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="OTP"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP sent to your email"
              icon="shield-checkmark-outline"
              keyboardType="number-pad"
              maxLength={6}
            />

            <Input
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              icon="lock-closed-outline"
              isSecure
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              icon="lock-closed-outline"
              isSecure
            />

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title="Reset Password"
              onPress={handleReset}
              loading={isLoading}
              variant="primary"
              size="large"
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {},
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  successText: {
    ...Typography.h3,
    color: Colors.success,
    marginTop: Spacing.lg,
  },
  successSubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
