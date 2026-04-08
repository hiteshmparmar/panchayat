import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { Ticket, categoryMeta } from '../lib/types';
import { getTimeAgo, getUrgencyColor } from '../lib/theme';
import { StatusBadge } from './StatusBadge';
import { useAppStore } from '../lib/store';

interface TicketCardProps {
  ticket: Ticket;
  onPress?: () => void;
}

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  const isDark = useAppStore((s) => s.isDark);
  const router = useRouter();
  const C = isDark ? Colors : Colors;
  const meta = categoryMeta[ticket.category];
  const urgencyColor = getUrgencyColor(ticket.urgency as 1 | 2 | 3);

  const handlePress = () => {
    if (onPress) onPress();
    else router.push(`/ticket/${ticket.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight, borderColor: isDark ? Colors.borderDark : Colors.borderLight }]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Urgency stripe */}
      <View style={[styles.urgencyStripe, { backgroundColor: urgencyColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryIcon, { backgroundColor: meta.color + '22' }]}>
              <Text style={styles.emoji}>{meta.emoji}</Text>
            </View>
            <View>
              <Text style={[styles.category, { color: meta.color }]}>{meta.label}</Text>
              <Text style={[styles.subcategory, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]} numberOfLines={1}>
                {ticket.subcategory}
              </Text>
            </View>
          </View>
          <StatusBadge status={ticket.status} small />
        </View>

        <Text style={[styles.description, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]} numberOfLines={2}>
          {ticket.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>
              🏠 {ticket.flat_number}
            </Text>
            {ticket.assigned_vendor_id && (
              <Text style={[styles.metaText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]}>
                👷 Agent Assigned
              </Text>
            )}
          </View>
          <View style={styles.rightMeta}>
            <Text style={[styles.ticketId, { color: Colors.saffron }]}>{ticket.id.substring(0, 8).toUpperCase()}</Text>
            <Text style={[styles.timeAgo, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>
              {getTimeAgo(ticket.created_at)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  urgencyStripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  category: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.sm,
  },
  subcategory: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  description: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  meta: {
    gap: 3,
  },
  metaText: {
    fontFamily: FontFamily.interRegular,
    fontSize: 11,
  },
  rightMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  ticketId: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: 11,
    fontWeight: '500',
  },
  timeAgo: {
    fontFamily: FontFamily.interRegular,
    fontSize: 11,
  },
});
