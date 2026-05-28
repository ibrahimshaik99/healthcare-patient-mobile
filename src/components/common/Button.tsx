import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Colors, Typography, BorderRadius, Spacing, Shadows} from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...sizeStyles[size],
      ...(fullWidth ? {width: '100%'} : {}),
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: isDisabled ? Colors.textTertiary : Colors.primary,
          ...Shadows.md,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: isDisabled ? Colors.textTertiary : Colors.secondary,
          ...Shadows.md,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: Colors.transparent,
          borderWidth: 1.5,
          borderColor: isDisabled ? Colors.border : Colors.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: Colors.transparent,
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {...sizeTextStyles[size]};
    switch (variant) {
      case 'primary':
      case 'secondary':
        return {...base, color: Colors.textInverse};
      case 'outline':
        return {...base, color: isDisabled ? Colors.textTertiary : Colors.primary};
      case 'ghost':
        return {...base, color: isDisabled ? Colors.textTertiary : Colors.primary};
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), icon ? {marginLeft: Spacing.sm} : {}, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const sizeStyles: Record<string, ViewStyle> = {
  small: {paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md},
  medium: {paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.md},
  large: {paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.lg},
};

const sizeTextStyles: Record<string, TextStyle> = {
  small: {...Typography.buttonSmall},
  medium: {...Typography.button},
  large: {...Typography.button, fontSize: 18},
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
