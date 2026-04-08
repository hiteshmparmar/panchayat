import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, SectionList,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';

const ROLE_COLORS: Record<string, string> = {
  chairman: '#8B5CF6',
  secretary: Colors.saffron,
  treasurer: Colors.trustBlue,
  resident: Colors.successGreen,
};

const AMENITIES = [
  { emoji: '🏋️', name: 'Gymnasium', hours: '6 AM – 9 PM', status: 'open' },
  { emoji: '🏊', name: 'Swimming Pool', hours: '6 AM – 8 PM', status: 'open' },
  { emoji: '🎭', name: 'Clubhouse', hours: '8 AM – 10 PM', status: 'open' },
  { emoji: '🏸', name: 'Badminton Court', hours: '6 AM – 10 PM', status: 'open' },
  { emoji: '🃏', name: 'Card Room', hours: '10 AM – 10 PM', status: 'open' },
];

export default function SocietyScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const user = useAppStore((s) => s.user);
  const [tab, setTab] = useState<'directory' | 'amenities' | 'committee'>('directory');

  const committee: any[] = [];
  const residents: any[] = [];
  const societyResidents: any[] = [];

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;
  const textTertiary = isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight;


  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimary }]}>My Society</Text>
        <Text style={[styles.sub, { color: textSecondary }]}>🏢 {user?.society_id || 'Join a society'}</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: border }]}>
        {(['directory', 'amenities', 'committee'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, { borderBottomWidth: tab === t ? 2 : 0, borderBottomColor: Colors.saffron }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? Colors.saffron : textSecondary }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'directory' && (
          <View style={styles.list}>
            {societyResidents.length === 0 ? (
              <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13, textAlign: 'center', paddingTop: 20 }}>No residents found.</Text>
            ) : societyResidents.map((r) => (
              <View key={r.id} style={[styles.residentCard, { backgroundColor: surface, borderColor: border }]}>
                <View style={[styles.avatar, { backgroundColor: (ROLE_COLORS[r.role] ?? Colors.saffron) + '22' }]}>
                  <Text style={[styles.avatarText, { color: ROLE_COLORS[r.role] ?? Colors.saffron }]}>
                    {r.name.split(' ').map((n: string) => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.residentInfo}>
                  <Text style={[styles.residentName, { color: textPrimary }]}>{r.name}</Text>
                  <Text style={[styles.residentMeta, { color: textSecondary }]}>{r.flat} · {r.phone}</Text>
                </View>
                {r.role !== 'resident' && (
                  <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[r.role] ?? Colors.saffron) + '22' }]}>
                    <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[r.role] ?? Colors.saffron }]}>
                      {r.role}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === 'amenities' && (
          <View style={styles.list}>
            {AMENITIES.map((a, i) => (
              <TouchableOpacity key={i} style={[styles.amenityCard, { backgroundColor: surface, borderColor: border }]} activeOpacity={0.75}>
                <Text style={styles.amenityEmoji}>{a.emoji}</Text>
                <View style={styles.amenityInfo}>
                  <Text style={[styles.amenityName, { color: textPrimary }]}>{a.name}</Text>
                  <Text style={[styles.amenityHours, { color: textSecondary }]}>{a.hours}</Text>
                </View>
                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: Colors.saffron + '22', borderColor: Colors.saffron + '44' }]}>
                  <Text style={[styles.bookBtnText, { color: Colors.saffron }]}>Book</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'committee' && (
          <View style={styles.list}>
            <View style={[styles.committeeCard, { backgroundColor: surface, borderColor: border }]}>
              <Text style={[styles.committeeTitle, { color: textPrimary }]}>Management Committee</Text>
              <Text style={[styles.committeeYear, { color: textTertiary }]}>2025-2026</Text>
              {committee.length === 0 ? (
                <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13, paddingTop: 10 }}>No committee members listed.</Text>
              ) : committee.map((c) => (
                <View key={c.id} style={[styles.committeeRow, { borderTopColor: border }]}>
                  <View style={[styles.avatar, { backgroundColor: (ROLE_COLORS[c.role] ?? Colors.saffron) + '22' }]}>
                    <Text style={[styles.avatarText, { color: ROLE_COLORS[c.role] ?? Colors.saffron }]}>
                      {c.name.split(' ').map((n: string) => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.residentName, { color: textPrimary }]}>{c.name}</Text>
                    <Text style={[styles.residentMeta, { color: textSecondary }]}>{c.flat}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[c.role] ?? Colors.saffron) + '22', marginLeft: 'auto' }]}>
                    <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[c.role] ?? Colors.saffron }]}>{c.role}</Text>
                  </View>
                </View>
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontFamily: FontFamily.interBold, fontSize: FontSize['2xl'] },
  sub: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, marginTop: 2 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 20 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  list: { gap: 10 },
  residentCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    borderWidth: 1, padding: 12, gap: 12,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontFamily: FontFamily.interBold, fontSize: FontSize.sm },
  residentInfo: { flex: 1 },
  residentName: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  residentMeta: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 2 },
  roleBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  roleBadgeText: { fontFamily: FontFamily.interMedium, fontSize: 11 },
  amenityCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    borderWidth: 1, padding: 14, gap: 14,
  },
  amenityEmoji: { fontSize: 28 },
  amenityInfo: { flex: 1 },
  amenityName: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  amenityHours: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 2 },
  bookBtn: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  bookBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  committeeCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  committeeTitle: { fontFamily: FontFamily.interBold, fontSize: FontSize.md },
  committeeYear: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: -8 },
  committeeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, paddingTop: 12 },
});
