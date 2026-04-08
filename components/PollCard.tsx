import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { useAppStore } from '../lib/store';

interface Poll {
  id: string;
  question: string;
  questionHi?: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  myVote: number | null;
  expiresAt: string;
}

interface PollCardProps {
  poll: Poll;
  onVote?: (optionIndex: number) => void;
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const isDark = useAppStore((s) => s.isDark);
  const lang = useAppStore((s) => s.user?.langPref ?? 'en');
  const [voted, setVoted] = useState(poll.myVote !== null);
  const [selectedOption, setSelectedOption] = useState<number | null>(poll.myVote);
  const [localVotes, setLocalVotes] = useState(poll.votes);

  const question = lang === 'hi' && poll.questionHi ? poll.questionHi : poll.question;
  const daysLeft = Math.ceil((new Date(poll.expiresAt).getTime() - Date.now()) / 86400000);

  const handleVote = (idx: number) => {
    if (voted) return;
    const newVotes = [...localVotes];
    newVotes[idx]++;
    setLocalVotes(newVotes);
    setSelectedOption(idx);
    setVoted(true);
    onVote?.(idx);
  };

  const totalVotes = localVotes.reduce((a, b) => a + b, 0);

  return (
    <View style={[styles.card, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight, borderColor: isDark ? Colors.borderDark : Colors.borderLight }]}>
      <View style={styles.header}>
        <Text style={[styles.pollBadge, { color: Colors.trustBlue }]}>📊 Active Poll</Text>
        <Text style={[styles.expiry, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>
          {daysLeft}d left
        </Text>
      </View>
      <Text style={[styles.question, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>
        {question}
      </Text>
      <View style={styles.options}>
        {poll.options.map((opt, i) => {
          const pct = totalVotes > 0 ? Math.round((localVotes[i] / totalVotes) * 100) : 0;
          const isSelected = selectedOption === i;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                {
                  borderColor: isSelected ? Colors.trustBlue : (isDark ? Colors.borderDark : Colors.borderLight),
                  backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2,
                },
              ]}
              onPress={() => handleVote(i)}
              disabled={voted}
              activeOpacity={0.7}
            >
              {voted && (
                <View style={[styles.progressBar, { width: `${pct}%` as any, backgroundColor: isSelected ? Colors.trustBlue + '30' : Colors.saffron + '18' }]} />
              )}
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight }]}>
                  {opt}
                </Text>
                {voted && (
                  <Text style={[styles.pctText, { color: isSelected ? Colors.trustBlue : (isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight) }]}>
                    {pct}%
                  </Text>
                )}
              </View>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.totalVotes, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>
        {totalVotes} votes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollBadge: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
  },
  expiry: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
  },
  question: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  options: {
    gap: 8,
  },
  option: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    flex: 1,
  },
  pctText: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    right: 12,
    top: 12,
    color: Colors.trustBlue,
    fontFamily: FontFamily.interBold,
    fontSize: 14,
  },
  totalVotes: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
    textAlign: 'right',
  },
});
