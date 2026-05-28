import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {authApi} from '../../services/api';
import {AuthStackParamList} from '../../navigation/AppNavigator';

type ForgotNavProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotNavProp>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendOTP = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      setSent(true);
      setTimeout(() => {
        navigation.navigate('ResetPassword', {verificationId: response.data.verificationId});
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to send OTP');
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
            <Icon name="lock-open-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you an OTP to reset your password
          </Text>
        </View>

        {sent ? (
          <View style={styles.sentContainer}>
            <Icon name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.sentText}>OTP Sent Successfully!</Text>
            <Text style={styles.sentSubtext}>Redirecting to reset password...</Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your registered email"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={isLoading}
              variant="primary"
              size="large"
            />

            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login')}>
              <Icon name="arrow-back" size={16} color={Colors.primary} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
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
    textAlign: 'center',
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
  sentContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  sentText: {
    ...Typography.h3,
    color: Colors.success,
    marginTop: Spacing.lg,
  },
  sentSubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  backToLoginText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
