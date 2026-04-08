import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { categoryMeta, Ticket } from '../../lib/types';
import { StatusBadge } from '../../components/StatusBadge';
import { getTimeAgo, getUrgencyColor, getUrgencyLabel, formatINR } from '../../lib/theme';

const TIMELINE = [
  { label: 'Ticket Created', done: true, time: '7:30 AM' },
  { label: 'Assigned to Vendor', done: true, time: '8:15 AM' },
  { label: 'Vendor En Route', done: true, time: '10:00 AM' },
  { label: 'Work in Progress', done: false, time: null },
  { label: 'Completed & Closed', done: false, time: null },
];

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isDark = useAppStore((s) => s.isDark);

  // In a real app, we would fetch the ticket by id here
  const ticket: Ticket = {
    id: id || 'UNKNOWN',
    category: 'other',
    subcategory: 'Unknown',
    description: 'Ticket details not found.',
    status: 'open',
    urgency: 1,
    flat_number: 'N/A',
    created_at: new Date().toISOString(),
  };
  const meta = categoryMeta[ticket.category];

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;
  const textTertiary = isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight;
  const urgColor = getUrgencyColor(ticket.urgency as 1 | 2 | 3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 18, color: textPrimary }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.ticketId, { color: Colors.saffron }]}>{ticket.id}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <LinearGradient
          colors={isDark ? ['#1E1A16', '#251E17'] : ['#FFF8F3', '#FDF0E5']}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: meta.color + '22' }]}>
              <Text style={{ fontSize: 28 }}>{meta.emoji}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={[styles.heroCategory, { color: meta.color }]}>{meta.label}</Text>
              <Text style={[styles.heroSubcat, { color: textPrimary }]}>{ticket.subcategory}</Text>
            </View>
            <StatusBadge status={ticket.status} />
          </View>

          <Text style={[styles.heroDescription, { color: textSecondary }]}>
            {ticket.description}
          </Text>

          <View style={styles.heroMeta}>
            <View style={styles.metaChip}>
              <Text style={[styles.metaChipLabel, { color: textTertiary }]}>Flat</Text>
              <Text style={[styles.metaChipValue, { color: textPrimary }]}>{ticket.flat_number}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={[styles.metaChipLabel, { color: textTertiary }]}>Urgency</Text>
              <Text style={[styles.metaChipValue, { color: urgColor }]}>{getUrgencyLabel(ticket.urgency as 1 | 2 | 3)}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={[styles.metaChipLabel, { color: textTertiary }]}>Filed</Text>
              <Text style={[styles.metaChipValue, { color: textPrimary }]}>{getTimeAgo(ticket.created_at)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Assigned vendor */}
        {ticket.assigned_vendor_id && (
          <View style={[styles.vendorCard, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionLabel, { color: textSecondary }]}>Assigned to</Text>
            <View style={styles.vendorRow}>
              <View style={[styles.vendorAvatar, { backgroundColor: Colors.saffron + '22' }]}>
                <Text style={{ fontSize: 20 }}>👷</Text>
              </View>
              <View>
                <Text style={[styles.vendorName, { color: textPrimary }]}>Service Agent</Text>
                <Text style={[styles.vendorEta, { color: Colors.successGreen }]}>⏱ ETA: Pending</Text>
              </View>
              <TouchableOpacity style={[styles.callBtn, { backgroundColor: Colors.successGreenMuted }]}>
                <Text style={[styles.callBtnText, { color: Colors.successGreen }]}>📞 Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={[styles.timelineCard, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.sectionLabel, { color: textSecondary }]}>Progress</Text>
          {TIMELINE.map((step, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: step.done ? Colors.successGreen : (isDark ? Colors.borderDark : Colors.borderLight), borderColor: step.done ? Colors.successGreen : (isDark ? Colors.borderDark : Colors.borderLight) },
                ]}>
                  {step.done && <Text style={{ fontSize: 10, color: '#fff' }}>✓</Text>}
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: step.done ? Colors.successGreen + '55' : (isDark ? Colors.borderDark : Colors.borderLight) }]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, { color: step.done ? textPrimary : textTertiary }]}>{step.label}</Text>
                {step.time && (
                  <Text style={[styles.timelineTime, { color: textTertiary }]}>{step.time}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Rate resolution (if resolved) */}
        {ticket.status === 'resolved' && (
          <View style={[styles.rateCard, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionLabel, { color: textSecondary }]}>Rate the resolution</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => Alert.alert('Thank you!', 'Your rating has been submitted.')}>
                  <Text style={{ fontSize: 28 }}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  backBtn: { paddingVertical: 4 },
  ticketId: { fontFamily: FontFamily.jetbrainsMono, fontSize: FontSize.sm, fontWeight: '500' },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 14 },
  heroCard: { borderRadius: 18, padding: 18, gap: 14 },
  heroHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  categoryIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  heroInfo: { flex: 1 },
  heroCategory: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  heroSubcat: { fontFamily: FontFamily.interBold, fontSize: FontSize.md, marginTop: 2 },
  heroDescription: { fontFamily: FontFamily.interRegular, fontSize: FontSize.base, lineHeight: 22 },
  heroMeta: { flexDirection: 'row', gap: 12 },
  metaChip: { flex: 1, gap: 3 },
  metaChipLabel: { fontFamily: FontFamily.interRegular, fontSize: 11 },
  metaChipValue: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  vendorCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  sectionLabel: { fontFamily: FontFamily.interMedium, fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 0.8 },
  vendorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vendorAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  vendorName: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  vendorEta: { fontFamily: FontFamily.interMedium, fontSize: FontSize.xs, marginTop: 2 },
  callBtn: { marginLeft: 'auto', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  callBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  timelineCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 0 },
  timelineRow: { flexDirection: 'row', gap: 14, minHeight: 52 },
  timelineLeft: { alignItems: 'center', width: 22 },
  timelineDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  timelineLine: { flex: 1, width: 2, marginTop: 4, marginBottom: 0 },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineLabel: { fontFamily: FontFamily.interMedium, fontSize: FontSize.base },
  timelineTime: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 3 },
  rateCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  starsRow: { flexDirection: 'row', gap: 8 },
});
