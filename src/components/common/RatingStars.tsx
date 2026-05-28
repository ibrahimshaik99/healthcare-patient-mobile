import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing} from '../../constants/theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  editable?: boolean;
  onRate?: (rating: number) => void;
  showRating?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  editable = false,
  onRate,
  showRating = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const renderStar = (star: number) => {
    const filled = star <= Math.floor(rating);
    const half = !filled && star - 0.5 <= rating;

    if (editable) {
      return (
        <TouchableOpacity key={star} onPress={() => onRate?.(star)}>
          <Icon
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? Colors.accent : Colors.textTertiary}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Icon
        key={star}
        name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
        size={size}
        color={filled || half ? Colors.accent : Colors.textTertiary}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {stars.map(renderStar)}
      </View>
      {showRating && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
