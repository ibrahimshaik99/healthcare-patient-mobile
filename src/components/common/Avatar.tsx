import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, BorderRadius} from '../../constants/theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
  showEdit?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 56,
  onPress,
  showEdit = false,
}) => {
  const getInitials = (): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (): string => {
    const colors = [
      Colors.primary,
      Colors.secondary,
      '#8B5CF6',
      '#EC4899',
      '#F97316',
      '#14B8A6',
      '#6366F1',
      '#EF4444',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const content = (
    <View style={[styles.container, {width: size, height: size, borderRadius: size / 2}]}>
      {source ? (
        <Image
          source={{uri: source}}
          style={[styles.image, {width: size, height: size, borderRadius: size / 2}]}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {width: size, height: size, borderRadius: size / 2, backgroundColor: getBackgroundColor()},
          ]}>
          <Text style={[styles.initials, {fontSize: size * 0.38}]}>{getInitials()}</Text>
        </View>
      )}
      {showEdit && (
        <View style={[styles.editBadge, {bottom: size * 0.02, right: size * 0.02}]}>
          <Text style={styles.editIcon}>✎</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontWeight: '600',
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  editIcon: {
    color: Colors.white,
    fontSize: 12,
  },
});
