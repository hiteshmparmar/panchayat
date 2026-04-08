import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { formatINR } from '../lib/theme';
import { useAppStore } from '../lib/store';

interface BreakdownItem {
  label: string;
  amount: number;
  icon: string;
  color: string;
}

interface FinanceNarrationProps {
  narration: string;
  breakdown: BreakdownItem[];
  total: number;
}

export function FinanceNarration({ narration, breakdown, total }: FinanceNarrationProps) {
  const isDark = useAppStore((s) => s.isDark);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight, borderColor: isDark ? Colors.borderDark : Colors.borderLight }]}>
      {/* AI Badge */}
      <View style={styles.headerRow}>
        <View style={styles.aiChip}>
          <Text style={styles.aiChipText}>✨ AI Narration</Text>
        </View>
        <TouchableOpacity onPress={() => setExpanded(e => !e)}>
          <Text style={{ color: Colors.saffron, fontFamily: FontFamily.interMedium, fontSize: FontSize.sm }}>
            {expanded ? 'Show less ▲' : 'View breakdown ▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Narration Text */}
      <Text style={[styles.narration, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]}>
        {narration}
      </Text>

      {/* Breakdown */}
      {expanded && (
        <View style={styles.breakdown}>
          <View style={[styles.divider, { backgroundColor: isDark ? Colors.borderDark : Colors.borderLight }]} />
          {breakdown.map((item, i) => (
            <View key={i} style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <Text style={styles.breakdownIcon}>{item.icon}</Text>
                <Text style={[styles.breakdownLabel, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]}>
                  {item.label}
                </Text>
              </View>
              <Text style={[styles.breakdownAmount, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>
                {formatINR(item.amount)}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: isDark ? Colors.borderDark : Colors.borderLight }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>Total</Text>
            <Text style={[styles.totalAmount, { color: Colors.saffron }]}>{formatINR(total)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiChip: {
    backgroundColor: Colors.saffronOverlay,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiChipText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    color: Colors.saffron,
  },
  narration: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  breakdown: {
    gap: 10,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownIcon: {
    fontSize: 18,
  },
  breakdownLabel: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
  },
  breakdownAmount: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
  },
  totalAmount: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
