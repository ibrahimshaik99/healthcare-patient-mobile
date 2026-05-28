import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, BorderRadius, Spacing} from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onVoicePress?: () => void;
  onFocus?: () => void;
  editable?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search doctors, clinics...',
  onFilterPress,
  onVoicePress,
  onFocus,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Icon name="search-outline" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          onFocus={onFocus}
          editable={editable}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
            <Icon name="close-circle" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {onFilterPress && (
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
          <Icon name="options-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      )}
      {onVoicePress && (
        <TouchableOpacity onPress={onVoicePress} style={styles.voiceButton}>
          <Icon name="mic-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
