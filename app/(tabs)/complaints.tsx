import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { TicketStatus } from '../../lib/types';
import { TicketCard } from '../../components/TicketCard';

const FILTERS: { key: TicketStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function ComplaintsScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const router = useRouter();
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;

  const tickets: any[] = [];
  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? Colors.borderDark : Colors.borderLight }]}>
        <View>
          <Text style={[styles.title, { color: textPrimary }]}>My Tickets</Text>
          <Text style={[styles.sub, { color: textSecondary }]}>{filtered.length} complaints</Text>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/complaint/new')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.newBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.newBtnText}>+ New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? Colors.saffron : (isDark ? Colors.surfaceDark : Colors.surfaceLight),
                borderColor: filter === f.key ? Colors.saffron : (isDark ? Colors.borderDark : Colors.borderLight),
              },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#fff' : textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tickets list */}
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={[styles.emptyText, { color: textSecondary }]}>No tickets here!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontFamily: FontFamily.interBold, fontSize: FontSize['2xl'] },
  sub: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, marginTop: 2 },
  newBtn: { borderRadius: 12, overflow: 'hidden' },
  newBtnGrad: { paddingHorizontal: 18, paddingVertical: 10 },
  newBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm, color: '#fff' },
  filterScroll: { maxHeight: 52 },
  filterRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: { fontFamily: FontFamily.interMedium, fontSize: FontSize.sm },
  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontFamily: FontFamily.interRegular, fontSize: FontSize.base },
});
