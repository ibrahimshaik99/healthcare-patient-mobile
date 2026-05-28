import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography, BorderRadius, Spacing} from '../../constants/theme';

interface BadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const STATUS_STYLES: Record<string, {bg: string; text: string; label: string}> = {
  pending: {bg: Colors.warningBg, text: Colors.warning, label: 'Pending'},
  confirmed: {bg: Colors.successBg, text: Colors.success, label: 'Confirmed'},
  cancelled: {bg: Colors.errorBg, text: Colors.error, label: 'Cancelled'},
  completed: {bg: Colors.infoBg, text: Colors.info, label: 'Completed'},
  missed: {bg: '#F3F4F6', text: Colors.textTertiary, label: 'Missed'},
  rescheduled: {bg: '#F5F3FF', text: '#8B5CF6', label: 'Rescheduled'},
  active: {bg: Colors.successBg, text: Colors.success, label: 'Active'},
  inactive: {bg: '#F3F4F6', text: Colors.textTertiary, label: 'Inactive'},
  refunded: {bg: '#FEF3C7', text: '#D97706', label: 'Refunded'},
  failed: {bg: Colors.errorBg, text: Colors.error, label: 'Failed'},
  success: {bg: Colors.successBg, text: Colors.success, label: 'Success'},
};

export const Badge: React.FC<BadgeProps> = ({status, size = 'medium'}) => {
  const style = STATUS_STYLES[status] || {bg: '#F3F4F6', text: Colors.textTertiary, label: status};

  return (
    <View style={[styles.badge, {backgroundColor: style.bg}, size === 'small' && styles.badgeSmall]}>
      <View style={[styles.dot, {backgroundColor: style.text}]} />
      <Text style={[styles.text, {color: style.text}, size === 'small' && styles.textSmall]}>
        {style.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs + 2,
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  textSmall: {
    fontSize: 10,
    lineHeight: 14,
  },
});
