import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Slot} from '../../types';

interface SlotSelectorProps {
  slots: Slot[];
  selectedSlotId?: string;
  onSelect: (slot: Slot) => void;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedSlotId,
  onSelect,
}) => {
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 17;
  });

  const renderSlotGroup = (title: string, groupSlots: Slot[]) => {
    if (groupSlots.length === 0) return null;

    return (
      <View style={styles.group}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.slotsGrid}>
          {groupSlots.map(slot => {
            const isSelected = slot.id === selectedSlotId;
            const isDisabled = !slot.isAvailable || slot.isBooked;

            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slot,
                  isSelected && styles.selectedSlot,
                  isDisabled && styles.disabledSlot,
                ]}
                onPress={() => !isDisabled && onSelect(slot)}
                disabled={isDisabled}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.slotTime,
                    isSelected && styles.selectedSlotText,
                    isDisabled && styles.disabledSlotText,
                  ]}>
                  {slot.startTime}
                </Text>
                <Text
                  style={[
                    styles.slotLabel,
                    isSelected && styles.selectedSlotText,
                    isDisabled && styles.disabledSlotText,
                  ]}>
                  {slot.isBooked ? 'Booked' : 'Available'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {slots.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No slots available for this date</Text>
        </View>
      ) : (
        <>
          {renderSlotGroup('Morning', morningSlots)}
          {renderSlotGroup('Afternoon', afternoonSlots)}
          {renderSlotGroup('Evening', eveningSlots)}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  slot: {
    width: '30%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  selectedSlot: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  disabledSlot: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.borderLight,
    opacity: 0.6,
  },
  slotTime: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedSlotText: {
    color: Colors.primary,
  },
  disabledSlotText: {
    color: Colors.textTertiary,
  },
  slotLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  empty: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
});
