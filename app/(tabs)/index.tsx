import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { DramaFilterCard } from '../../components/DramaFilterCard';
import { NoticeCard } from '../../components/NoticeCard';
import { PollCard } from '../../components/PollCard';
import { QuickActions } from '../../components/QuickActions';
import { getGreeting } from '../../lib/theme';
import { fetchNotices, fetchTickets } from '../../lib/api';

export default function HomeScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const user = useAppStore((s) => s.user);
  const role = useAppStore((s) => s.activeRole);
  const switchRole = useAppStore((s) => s.switchRole);
  const router = useRouter();

  const isSecretary = ['secretary', 'treasurer', 'chairman'].includes(role);
  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: textSecondary }]}>{getGreeting()},</Text>
            <Text style={[styles.userName, { color: textPrimary }]}>{user?.name?.split(' ')[0]} 👋</Text>
            <Text style={[styles.societyName, { color: Colors.saffron }]}>
              🏢 {user?.society_id ? 'Society Member' : 'Guest'} · {user?.flat_number || 'N/A'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight, borderColor: isDark ? Colors.borderDark : Colors.borderLight }]} onPress={toggleTheme}>
              <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Role switcher for demo */}
        <View style={styles.roleSwitcherRow}>
          {(['resident', 'secretary'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleChip,
                {
                  backgroundColor: role === r ? Colors.saffron : (isDark ? Colors.surfaceDark : Colors.surfaceLight),
                  borderColor: role === r ? Colors.saffron : (isDark ? Colors.borderDark : Colors.borderLight),
                },
              ]}
              onPress={() => switchRole(r)}
            >
              <Text style={[styles.roleChipText, { color: role === r ? '#fff' : textSecondary }]}>
                {r === 'resident' ? '👤 Resident' : '⚡ Secretary'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Secretary Drama Filter */}
        {isSecretary && (
          <View style={styles.section}>
            <DramaFilterCard data={null} onCreateTickets={() => router.push('/(tabs)/secretary')} />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Quick Actions</Text>
          <QuickActions />
        </View>

        {/* Active Poll */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Active Poll</Text>
          </View>
          <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13, marginBottom: 12 }}>No active polls found.</Text>

        {/* Notices */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Notices</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: Colors.saffron }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13 }}>No recent notices.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: { gap: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  greeting: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.base,
  },
  userName: {
    fontFamily: FontFamily.interBold,
    fontSize: FontSize['2xl'],
  },
  societyName: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSwitcherRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  roleChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  roleChipText: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.md,
    marginBottom: 12,
  },
  seeAll: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    marginBottom: 12,
  },
});
