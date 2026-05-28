import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors, BorderRadius, Spacing, Shadows} from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  header?: React.ReactNode;
  padding?: number;
  noShadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  header,
  padding = Spacing.lg,
  noShadow = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        noShadow ? {} : Shadows.md,
        {padding},
        style,
      ]}>
      {header && <View style={styles.header}>{header}</View>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  header: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
});
