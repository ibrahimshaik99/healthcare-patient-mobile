import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Input} from '../../components/common/Input';
import {Button} from '../../components/common/Button';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // API call to change password
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header title="Change Password" showBack />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <Icon name="lock-closed" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Enter your current password and set a new one</Text>
        </View>

        {success ? (
          <View style={styles.successContainer}>
            <Icon name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.successText}>Password Changed!</Text>
            <Text style={styles.successSubtext}>Redirecting to profile...</Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              icon="lock-closed-outline"
              isSecure
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              icon="lock-open-outline"
              isSecure
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              icon="lock-open-outline"
              isSecure
            />

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={[styles.requirement, newPassword.length >= 6 && styles.requirementMet]}>
                • At least 6 characters
              </Text>
              <Text style={[styles.requirement, /[A-Z]/.test(newPassword) && styles.requirementMet]}>
                • At least one uppercase letter
              </Text>
              <Text style={[styles.requirement, /[0-9]/.test(newPassword) && styles.requirementMet]}>
                • At least one number
              </Text>
            </View>

            <View style={styles.footer}>
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                loading={isLoading}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: Spacing.xl,
  },
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
  requirements: {
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  requirementsTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  requirement: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  requirementMet: {
    color: Colors.success,
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
  footer: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxxxl,
  },
});
