import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { useAppStore } from '../lib/store';

interface BylawChatBubbleProps {
  role: 'user' | 'bot';
  text: string;
  citation?: string;
  timestamp: string;
}

export function BylawChatBubble({ role, text, citation, timestamp }: BylawChatBubbleProps) {
  const isDark = useAppStore((s) => s.isDark);
  const [citationExpanded, setCitationExpanded] = useState(false);
  const isUser = role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperBot]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>⚖️</Text>
        </View>
      )}
      <View style={styles.bubbleCol}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: Colors.saffron }]
              : [styles.botBubble, {
                  backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2,
                  borderColor: isDark ? Colors.borderDark : Colors.borderLight,
                }],
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: isUser ? '#fff' : (isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight) },
            ]}
          >
            {text}
          </Text>
        </View>
        {citation && (
          <TouchableOpacity
            style={[
              styles.citationBadge,
              { backgroundColor: Colors.trustBlue + '18', borderColor: Colors.trustBlue + '44' },
            ]}
            onPress={() => setCitationExpanded(e => !e)}
          >
            <Text style={styles.citationText}>📎 {citation}</Text>
            <Text style={[styles.citationArrow, { color: Colors.trustBlue }]}>
              {citationExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        )}
        {citation && citationExpanded && (
          <View style={[
            styles.citationDetail,
            { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.trustBlueMuted, borderColor: Colors.trustBlue + '33' },
          ]}>
            <Text style={[styles.citationDetailText, { color: Colors.trustBlue }]}>
              Tap "View bylaws" to read the full text of {citation}.
            </Text>
          </View>
        )}
        <Text style={[styles.time, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight, alignSelf: isUser ? 'flex-end' : 'flex-start' }]}>
          {new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperBot: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.saffronOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarText: {
    fontSize: 16,
  },
  bubbleCol: {
    maxWidth: '78%',
    gap: 4,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  citationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    alignSelf: 'flex-start',
  },
  citationText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    color: Colors.trustBlue,
  },
  citationArrow: {
    fontSize: 10,
  },
  citationDetail: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  citationDetailText: {
    fontFamily: FontFamily.interRegular,
    fontSize: 12,
    lineHeight: 18,
  },
  time: {
    fontFamily: FontFamily.interRegular,
    fontSize: 10,
    marginTop: 2,
  },
});
