import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { FinanceNarration } from '../../components/FinanceNarration';
import { formatINR } from '../../lib/theme';

export default function FinanceScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const user = useAppStore((s) => s.user);
  const [paid, setPaid] = useState(false);

  const dues: any = null; // Placeholder for real dues
  const history: any[] = [];

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const surface2 = isDark ? Colors.surfaceDark2 : Colors.surfaceLight2;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;
  const textTertiary = isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight;

  const handlePay = () => {
    Alert.alert(
      'Pay Maintenance',
      'Proceed to payment gateway?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay via UPI', onPress: () => { Alert.alert('✅ Payment Successful', 'Maintenance paid.'); setPaid(true); } },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[styles.title, { color: textPrimary }]}>Finance</Text>
        <Text style={[styles.sub, { color: textSecondary }]}>Maintenance & Dues</Text>

        {/* Current Month Card */}
        <LinearGradient
          colors={paid ? ['#0F2D1A', '#142812'] : ['#2A1208', '#200E04']}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={styles.mainCardHeader}>
            <Text style={styles.mainCardMonth}>Current Month</Text>
            <View style={[styles.statusPill, { backgroundColor: paid ? Colors.successGreen + '33' : Colors.errorRed + '33' }]}>
              <Text style={[styles.statusPillText, { color: paid ? Colors.successGreen : Colors.errorRed }]}>
                {paid ? '✓ Paid' : 'Due'}
              </Text>
            </View>
          </View>
          <Text style={styles.mainCardAmount}>{formatINR(0)}</Text>
          <Text style={styles.mainCardLabel}>Monthly Maintenance</Text>
          {!paid && (
            <TouchableOpacity style={styles.payBtn} onPress={handlePay} activeOpacity={0.85}>
              <Text style={styles.payBtnText}>Pay Now via UPI →</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Where does your money go?</Text>
          <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13 }}>No financial breakdown available yet.</Text>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Payment History</Text>
          <View style={[styles.historyCard, { backgroundColor: surface, borderColor: border, padding: 20 }]}>
            <Text style={{ color: textSecondary, fontFamily: FontFamily.interRegular, fontSize: 13, textAlign: 'center' }}>No transaction history found.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mockSociety = { committee: { treasurer: 'Vikram Joshi' } };

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 0,
  },
  title: { fontFamily: FontFamily.interBold, fontSize: FontSize['2xl'] },
  sub: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, marginTop: 2, marginBottom: 20 },
  mainCard: {
    borderRadius: 20,
    padding: 22,
    gap: 6,
    marginBottom: 24,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainCardMonth: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  mainCardAmount: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -1,
  },
  mainCardLabel: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  payBtn: {
    marginTop: 14,
    backgroundColor: Colors.saffron,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  payBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base, color: '#fff' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.md,
    marginBottom: 12,
  },
  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  rowDivider: { height: 1, marginHorizontal: 14 },
  historyMonth: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  historyDate: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 2 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  historyAmount: { fontFamily: FontFamily.jetbrainsMono, fontSize: FontSize.base, fontWeight: '500' },
  paidBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  paidBadgeText: { fontFamily: FontFamily.interMedium, fontSize: FontSize.xs },
});
