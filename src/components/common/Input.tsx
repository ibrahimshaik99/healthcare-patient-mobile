import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, BorderRadius, Spacing} from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  isSecure?: boolean;
  onIconPress?: () => void;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  isSecure,
  onIconPress,
  required,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputContainer, {borderColor: getBorderColor()}]}>
        {icon && iconPosition === 'left' && (
          <Icon
            name={icon}
            size={20}
            color={isFocused ? Colors.primary : Colors.textTertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && iconPosition === 'left' ? styles.inputWithLeftIcon : {},
            icon && iconPosition === 'right' ? styles.inputWithRightIcon : {},
            isSecure ? styles.inputWithSecure : {},
            style,
          ]}
          placeholderTextColor={Colors.textTertiary}
          secureTextEntry={isSecure && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isSecure && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.secureToggle}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        )}
        {icon && iconPosition === 'right' && (
          <TouchableOpacity onPress={onIconPress} style={styles.rightIcon}>
            <Icon
              name={icon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.sm,
  },
  inputWithSecure: {
    paddingRight: Spacing.xxxl,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
  },
  rightIcon: {
    paddingRight: Spacing.md,
  },
  secureToggle: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
