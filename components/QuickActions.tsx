import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { useAppStore } from '../lib/store';

const ACTIONS = [
  { id: 'pay',      emoji: '💳', label: 'Pay\nMaintenance', route: '/(tabs)/finance', color: Colors.trustBlue,    bg: Colors.trustBlueMuted    },
  { id: 'complaint',emoji: '🎤', label: 'File\nComplaint',  route: '/complaint/new',  color: Colors.saffron,      bg: Colors.saffronMuted      },
  { id: 'bylaw',    emoji: '📜', label: 'Bylaw\nBot',       route: '/bylaw-bot',      color: Colors.successGreen, bg: Colors.successGreenMuted },
  { id: 'gate',     emoji: '🚪', label: 'Gate\nPass',       route: '/(tabs)/society', color: '#8B5CF6',           bg: '#F5F3FF'                },
];

export function QuickActions() {
  const isDark = useAppStore((s) => s.isDark);
  const router = useRouter();

  return (
    <View style={styles.row}>
      {ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.id}
          style={[
            styles.action,
            {
              backgroundColor: isDark
                ? a.color + '18'
                : a.bg,
              borderColor: isDark ? a.color + '33' : a.color + '44',
            },
          ]}
          onPress={() => router.push(a.route as any)}
          activeOpacity={0.75}
        >
          <Text style={styles.emoji}>{a.emoji}</Text>
          <Text style={[styles.label, { color: isDark ? Colors.textPrimaryDark : a.color }]}>
            {a.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
});
