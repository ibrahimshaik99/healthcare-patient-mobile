import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {Colors, BorderRadius, Spacing} from '../../constants/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'profile' | 'doctor';
  count?: number;
}

const SkeletonBlock: React.FC<{style?: any}> = ({style}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {opacity},
        style,
      ]}
    />
  );
};

const CardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.cardRow}>
      <SkeletonBlock style={styles.avatar} />
      <View style={styles.cardContent}>
        <SkeletonBlock style={styles.titleLine} />
        <SkeletonBlock style={styles.subtitleLine} />
        <SkeletonBlock style={styles.subtitleLineSmall} />
      </View>
    </View>
  </View>
);

const DoctorSkeleton: React.FC = () => (
  <View style={styles.doctorCard}>
    <SkeletonBlock style={styles.doctorImage} />
    <View style={styles.doctorInfo}>
      <SkeletonBlock style={styles.doctorName} />
      <SkeletonBlock style={styles.doctorSpec} />
      <View style={styles.doctorRow}>
        <SkeletonBlock style={styles.doctorRating} />
        <SkeletonBlock style={styles.doctorFees} />
      </View>
    </View>
  </View>
);

const ProfileSkeleton: React.FC = () => (
  <View style={styles.profileContainer}>
    <SkeletonBlock style={styles.profileAvatar} />
    <SkeletonBlock style={styles.profileName} />
    <SkeletonBlock style={styles.profileSubtitle} />
    <View style={styles.profileDetails}>
      <SkeletonBlock style={styles.detailItem} />
      <SkeletonBlock style={styles.detailItem} />
      <SkeletonBlock style={styles.detailItem} />
    </View>
  </View>
);

const ListSkeleton: React.FC = () => (
  <View style={styles.listItem}>
    <SkeletonBlock style={styles.listIcon} />
    <View style={styles.listContent}>
      <SkeletonBlock style={styles.listTitle} />
      <SkeletonBlock style={styles.listSubtitle} />
    </View>
    <SkeletonBlock style={styles.listAction} />
  </View>
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 3,
}) => {
  const items = Array(count).fill(0);

  const renderItem = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'doctor':
        return <DoctorSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'list':
        return <ListSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <View style={styles.container}>
      {items.map((_, index) => (
        <View key={index}>{renderItem()}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  block: {
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  titleLine: {
    height: 16,
    width: '60%',
    marginBottom: Spacing.sm,
  },
  subtitleLine: {
    height: 12,
    width: '80%',
    marginBottom: Spacing.xs,
  },
  subtitleLineSmall: {
    height: 12,
    width: '40%',
  },
  doctorCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    marginRight: Spacing.md,
    width: 200,
  },
  doctorImage: {
    height: 120,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  doctorInfo: {
    padding: Spacing.md,
  },
  doctorName: {
    height: 16,
    width: '70%',
    marginBottom: Spacing.xs,
  },
  doctorSpec: {
    height: 12,
    width: '90%',
    marginBottom: Spacing.sm,
  },
  doctorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doctorRating: {
    height: 12,
    width: '30%',
  },
  doctorFees: {
    height: 12,
    width: '30%',
  },
  profileContainer: {
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.lg,
  },
  profileName: {
    height: 20,
    width: '40%',
    marginBottom: Spacing.sm,
  },
  profileSubtitle: {
    height: 14,
    width: '25%',
    marginBottom: Spacing.xxl,
  },
  profileDetails: {
    width: '100%',
  },
  detailItem: {
    height: 56,
    width: '100%',
    marginBottom: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  listTitle: {
    height: 14,
    width: '50%',
    marginBottom: Spacing.xs,
  },
  listSubtitle: {
    height: 12,
    width: '70%',
  },
  listAction: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
