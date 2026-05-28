import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {format, addDays, isSameDay, parseISO} from 'date-fns';
import {Colors, Typography, Spacing, BorderRadius} from '../../constants/theme';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  numDays?: number;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelect,
  numDays = 14,
}) => {
  const today = new Date();
  const dates = Array.from({length: numDays}, (_, i) => addDays(today, i));

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {dates.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isSelected = dateStr === selectedDate;
          const isToday = isSameDay(date, today);
          const dayName = format(date, 'EEE');
          const dayNumber = format(date, 'dd');
          const month = format(date, 'MMM');

          return (
            <TouchableOpacity
              key={dateStr}
              style={[styles.dateItem, isSelected && styles.selectedDate]}
              onPress={() => onSelect(dateStr)}
              activeOpacity={0.7}>
              <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                {isToday ? 'Today' : dayName}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                {dayNumber}
              </Text>
              <Text style={[styles.month, isSelected && styles.selectedText]}>
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dateItem: {
    width: 64,
    height: 88,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  selectedDate: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  dayName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dayNumber: {
    ...Typography.h3,
    color: Colors.text,
    marginVertical: 2,
  },
  month: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.primary,
  },
});
