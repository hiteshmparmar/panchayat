import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';
import { useAppStore } from '../lib/store';
import { queryBylaws } from '../lib/api';
import { BylawChatBubble } from '../components/BylawChatBubble';


export default function BylawBotScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const lang = useAppStore((s) => s.user?.lang_pref ?? 'en');
  const [localLang, setLocalLang] = useState<'en' | 'hi'>(lang as 'en' | 'hi');
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'init-1',
      role: 'bot',
      text: 'Namaste! I am your AI Bylaw Bot. Ask me anything about your society rules.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: `msg-${messages.length + 1}`,
      role: 'user' as const,
      text: input,
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await queryBylaws(input, localLang);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${prev.length + 1}`,
            role: 'bot' as const,
            text: response.text,
            citation: response.citation,
            timestamp: new Date().toISOString(),
          },
        ]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (err) {
        setIsTyping(false);
        Alert.alert('Error', 'Failed to reach Bylaw Bot. Please try again later.');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22, color: textPrimary }}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: textPrimary }]}>⚖️ Bylaw Bot</Text>
          <Text style={[styles.sub, { color: textSecondary }]}>Greenwood Heights Rules</Text>
        </View>
        {/* Lang toggle */}
        <View style={[styles.langToggle, { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2 }]}>
          {(['en', 'hi'] as const).map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.langBtn, { backgroundColor: localLang === l ? Colors.trustBlue : 'transparent' }]}
              onPress={() => setLocalLang(l)}
            >
              <Text style={[styles.langText, { color: localLang === l ? '#fff' : textSecondary }]}>
                {l === 'en' ? 'EN' : 'हिं'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chat */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <BylawChatBubble
              role={item.role}
              text={item.text}
              citation={(item as any).citation}
              timestamp={item.timestamp}
            />
          )}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.typingBubble, { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2 }]}>
                <Text style={{ color: textSecondary }}>⚖️ Searching bylaws...</Text>
              </View>
            ) : null
          }
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight, borderTopColor: border }]}>
          {/* Quick question chips */}
          <View style={styles.quickChips}>
            {['Parking rules?', 'Pet policy?', 'Noise after 10PM?'].map((q) => (
              <TouchableOpacity
                key={q}
                style={[styles.quickChip, { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2, borderColor: border }]}
                onPress={() => setInput(q)}
              >
                <Text style={[styles.quickChipText, { color: textSecondary }]}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2, borderColor: border, color: textPrimary },
              ]}
              placeholder={localLang === 'hi' ? 'कोई सवाल पूछें...' : 'Ask a question about your bylaws...'}
              placeholderTextColor={isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: Colors.trustBlue, opacity: input.trim() ? 1 : 0.4 }]}
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Text style={styles.sendBtnText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  sub: { fontFamily: FontFamily.interRegular, fontSize: 11, marginTop: 1 },
  langToggle: { flexDirection: 'row', borderRadius: 10, padding: 3, gap: 3 },
  langBtn: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  langText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.xs },
  chatList: { paddingTop: 16, paddingBottom: 8 },
  typingBubble: {
    marginHorizontal: 16, marginBottom: 8, borderRadius: 14,
    padding: 12, alignSelf: 'flex-start',
  },
  inputBar: {
    borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  quickChips: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  quickChip: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  quickChipText: { fontFamily: FontFamily.interRegular, fontSize: 12 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1, borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: FontFamily.interRegular, fontSize: FontSize.base,
  },
  sendBtn: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#fff', fontSize: 20, fontFamily: FontFamily.interBold },
});
