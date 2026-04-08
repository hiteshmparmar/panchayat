import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { useAppStore } from '../lib/store';
import { getTimeAgo } from '../lib/theme';
interface DramaFilterCardProps {
  data: {
    rawCount: number;
    generatedAt: string;
    urgent: string[];
    briefing: string[];
    topCategories: string[];
  } | null;
  onCreateTickets?: () => void;
}

export function DramaFilterCard({ data, onCreateTickets }: DramaFilterCardProps) {
  const isDark = useAppStore((s) => s.isDark);
  const [expanded, setExpanded] = useState(true);

  if (!data) return null;

  return (
    <View style={[styles.container, { borderColor: isDark ? Colors.borderDark : Colors.borderLight }]}>
      <LinearGradient
        colors={isDark
          ? ['#1E1A16', '#251E17']
          : ['#FFF8F3', '#FDF3EA']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiText}>AI</Text>
            </View>
            <View>
              <Text style={[styles.title, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>
                Drama Filter
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight }]}>
                {data.rawCount} messages analysed · {getTimeAgo(data.generatedAt)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.chevron}>
            <Text style={{ color: Colors.saffron, fontSize: 18 }}>{expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        </View>

        {expanded && (
          <>
            {/* Urgent */}
            {data.urgent.length > 0 && (
              <View style={styles.urgentSection}>
                {data.urgent.map((u, i) => (
                  <View key={i} style={styles.urgentRow}>
                    <LinearGradient
                      colors={['#EF444422', '#EF444408']}
                      style={styles.urgentCard}
                    >
                      <Text style={styles.urgentText}>{u}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            )}

            {/* Briefing */}
            <View style={styles.briefingList}>
              {data.briefing.map((point, i) => (
                <View key={i} style={styles.briefingRow}>
                  <Text style={styles.bulletNum}>{i + 1}</Text>
                  <Text style={[styles.briefingText, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>

            {/* Tags */}
            <View style={styles.tagRow}>
              {data.topCategories.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onCreateTickets}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.saffron, Colors.saffronDark]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>⚡ Create Tickets for All</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    backgroundColor: Colors.saffron,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aiText: {
    fontFamily: FontFamily.interBold,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 1,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.md,
  },
  subtitle: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  chevron: {
    padding: 4,
  },
  urgentSection: {
    marginBottom: 12,
  },
  urgentRow: {
    marginBottom: 6,
  },
  urgentCard: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EF444433',
  },
  urgentText: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    color: '#EF4444',
    lineHeight: 20,
  },
  briefingList: {
    gap: 10,
    marginBottom: 14,
  },
  briefingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bulletNum: {
    fontFamily: FontFamily.interBold,
    fontSize: 12,
    color: Colors.saffron,
    width: 18,
    marginTop: 1,
  },
  briefingText: {
    flex: 1,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    backgroundColor: Colors.saffronOverlay,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
    color: Colors.saffron,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 13,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
