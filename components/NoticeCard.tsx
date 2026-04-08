import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { getTimeAgo } from '../lib/theme';
import { useAppStore } from '../lib/store';

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  createdBy: string;
  createdAt: string;
  isImportant: boolean;
}

interface NoticeCardProps {
  notice: Notice;
  onPress?: () => void;
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string }> = {
  maintenance: { emoji: '🔧', color: Colors.saffron },
  meeting:     { emoji: '📅', color: Colors.trustBlue },
  policy:      { emoji: '📋', color: '#8B5CF6' },
  event:       { emoji: '🎉', color: Colors.successGreen },
  emergency:   { emoji: '🚨', color: Colors.errorRed },
};

export function NoticeCard({ notice, onPress }: NoticeCardProps) {
  const isDark = useAppStore((s) => s.isDark);
  const config = CATEGORY_CONFIG[notice.category] ?? { emoji: '📢', color: Colors.saffron };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight,
          borderColor: notice.isImportant
            ? config.color + '55'
            : (isDark ? Colors.borderDark : Colors.borderLight),
          borderLeftWidth: notice.isImportant ? 4 : 1,
          borderLeftColor: notice.isImportant ? config.color : (isDark ? Colors.borderDark : Colors.borderLight),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: config.color + '18' }]}>
          <Text style={styles.icon}>{config.emoji}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text
            style={[styles.title, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}
            numberOfLines={1}
          >
            {notice.title}
          </Text>
          <Text style={[styles.meta, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>
            {notice.createdBy} · {getTimeAgo(notice.createdAt)}
          </Text>
        </View>
        {notice.isImportant && (
          <View style={[styles.importantBadge, { backgroundColor: config.color + '22' }]}>
            <Text style={[styles.importantText, { color: config.color }]}>!</Text>
          </View>
        )}
      </View>
      <Text
        style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]}
        numberOfLines={2}
      >
        {notice.body}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
  },
  meta: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  importantBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantText: {
    fontFamily: FontFamily.interBold,
    fontSize: FontSize.sm,
  },
  body: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});
