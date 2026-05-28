import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal, Text} from 'react-native';
import {Colors, Typography, BorderRadius, Spacing} from '../../constants/theme';

interface LoaderProps {
  visible?: boolean;
  overlay?: boolean;
  message?: string;
  size?: 'small' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({
  visible = true,
  overlay = false,
  message,
  size = 'large',
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={size} color={Colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.xxl + 8,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  message: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
