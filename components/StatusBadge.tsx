import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { getStatusColor } from '../lib/theme';
import { TicketStatus } from '../lib/types';

interface StatusBadgeProps {
  status: TicketStatus;
  small?: boolean;
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const color = getStatusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }, small && styles.small]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }, small && styles.smallLabel]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.xs,
    letterSpacing: 0.2,
  },
  smallLabel: {
    fontSize: 10,
  },
});
