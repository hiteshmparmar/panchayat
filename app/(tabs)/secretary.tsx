import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { Ticket, TicketStatus } from '../../lib/types';
import { DramaFilterCard } from '../../components/DramaFilterCard';
import { TicketCard } from '../../components/TicketCard';

const KANBAN_COLS: { key: TicketStatus; label: string; emoji: string }[] = [
  { key: 'open',        label: 'Open',        emoji: '🔴' },
  { key: 'assigned',    label: 'Assigned',    emoji: '🟡' },
  { key: 'in_progress', label: 'In Progress', emoji: '🟠' },
  { key: 'resolved',    label: 'Resolved',    emoji: '🟢' },
];

export default function SecretaryScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const [activeCol, setActiveCol] = useState<TicketStatus>('open');

  const tickets: Ticket[] = [];
  const vendors: any[] = [];
  const dramaData = null;

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;

  const colTickets = tickets.filter((t) => t.status === activeCol);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: textPrimary }]}>Secretary Mode</Text>
            <Text style={[styles.sub, { color: textSecondary }]}>⚡ Greenwood Heights</Text>
          </View>
          <View style={[styles.secretaryBadge, { backgroundColor: Colors.saffron }]}>
            <Text style={styles.secretaryBadgeText}>SECRETARY</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: Colors.statusOpen },
            { label: 'In Progress', value: tickets.filter((t) => t.status === 'in_progress').length, color: Colors.saffron },
            { label: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, color: Colors.successGreen },
            { label: 'Vendors', value: vendors.length, color: '#8B5CF6' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Drama Filter */}
        <View style={styles.section}>
          <DramaFilterCard data={dramaData} />
        </View>

        {/* Ticket Kanban */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Ticket Dashboard</Text>

          {/* Column selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colScroll} contentContainerStyle={styles.colRow}>
            {KANBAN_COLS.map((col) => {
              const count = tickets.filter((t) => t.status === col.key).length;
              return (
                <TouchableOpacity
                  key={col.key}
                  style={[
                    styles.colChip,
                    {
                      backgroundColor: activeCol === col.key ? Colors.saffron : (isDark ? Colors.surfaceDark : Colors.surfaceLight),
                      borderColor: activeCol === col.key ? Colors.saffron : border,
                    },
                  ]}
                  onPress={() => setActiveCol(col.key)}
                >
                  <Text style={[styles.colChipText, { color: activeCol === col.key ? '#fff' : textSecondary }]}>
                    {col.emoji} {col.label} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {colTickets.length === 0 ? (
            <View style={styles.emptyCol}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={[styles.emptyText, { color: textSecondary }]}>No tickets in this column</Text>
            </View>
          ) : (
            colTickets.map((t) => <TicketCard key={t.id} ticket={t} />)
          )}
        </View>

        {/* Vendor List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Vendors</Text>
          {vendors.map((v) => (
            <View key={v.id} style={[styles.vendorCard, { backgroundColor: surface, borderColor: border }]}>
              <Text style={styles.vendorEmoji}>
                {v.category === 'plumbing' ? '🔧' : v.category === 'elevator' ? '🛗' : v.category === 'electrical' ? '⚡' : v.category === 'gardening' ? '🌿' : '🛡️'}
              </Text>
              <View style={styles.vendorInfo}>
                <Text style={[styles.vendorName, { color: textPrimary }]}>{v.name}</Text>
                <Text style={[styles.vendorMeta, { color: textSecondary }]}>{v.phone}</Text>
              </View>
              <View style={styles.vendorRating}>
                <Text style={styles.ratingText}>⭐ {v.rating}</Text>
              </View>
            </View>
          ))}
          {vendors.length === 0 && (
            <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13, textAlign: 'center', padding: 20 }}>No vendors listed.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  title: { fontFamily: FontFamily.interBold, fontSize: FontSize['2xl'] },
  sub: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, marginTop: 2 },
  secretaryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  secretaryBadgeText: { fontFamily: FontFamily.interBold, fontSize: 10, color: '#fff', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    paddingVertical: 12, alignItems: 'center', gap: 4,
  },
  statValue: { fontFamily: FontFamily.interBold, fontSize: FontSize.xl },
  statLabel: { fontFamily: FontFamily.interRegular, fontSize: 10, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.md, marginBottom: 12 },
  colScroll: { maxHeight: 50 },
  colRow: { gap: 8, paddingBottom: 12 },
  colChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  colChipText: { fontFamily: FontFamily.interMedium, fontSize: FontSize.sm },
  emptyCol: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 36 },
  emptyText: { fontFamily: FontFamily.interRegular, fontSize: FontSize.base },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1, padding: 12, gap: 12, marginBottom: 8,
  },
  vendorEmoji: { fontSize: 24 },
  vendorInfo: { flex: 1 },
  vendorName: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  vendorMeta: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 2 },
  vendorRating: {
    backgroundColor: '#F59E0B22',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  ratingText: { fontFamily: FontFamily.interMedium, fontSize: 12, color: '#F59E0B' },
});
