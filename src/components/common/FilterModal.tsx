import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Button} from './Button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSection {
  title: string;
  key: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onReset: () => void;
  sections: FilterSection[];
  currentFilters: Record<string, any>;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onReset,
  sections,
  currentFilters,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(currentFilters);

  const toggleOption = (sectionKey: string, value: string, multiSelect?: boolean) => {
    setSelectedFilters(prev => {
      if (multiSelect) {
        const current = prev[sectionKey] || [];
        const updated = current.includes(value)
          ? current.filter((v: string) => v !== value)
          : [...current, value];
        return {...prev, [sectionKey]: updated};
      }
      return {...prev, [sectionKey]: prev[sectionKey] === value ? undefined : value};
    });
  };

  const isSelected = (sectionKey: string, value: string): boolean => {
    const current = selectedFilters[sectionKey];
    if (Array.isArray(current)) {
      return current.includes(value);
    }
    return current === value;
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilters({});
    onReset();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe>
      <View style={styles.container}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {sections.map(section => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.optionsGrid}>
                {section.options.map(option => {
                  const active = isSelected(section.key, option.value);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.optionChip, active && styles.activeChip]}
                      onPress={() => toggleOption(section.key, option.value, section.multiSelect)}>
                      <Text style={[styles.optionText, active && styles.activeText]}>
                        {option.label}
                      </Text>
                      {active && (
                        <Icon name="checkmark" size={16} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Apply Filters" onPress={handleApply} variant="primary" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    ...Shadows.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
  },
  resetText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.xs,
  },
  activeChip: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  optionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
