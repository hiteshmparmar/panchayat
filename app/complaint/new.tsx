import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Animated, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';
import { categoryMeta, TicketCategory } from '../../lib/types';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { transcribeAndClassify, VoiceToTicketResult } from '../../lib/api';

const CATEGORIES: TicketCategory[] = [
  'plumbing', 'electrical', 'civil', 'security', 'noise', 'parking', 'elevator', 'common_area', 'other',
];

type RecordingState = 'idle' | 'recording' | 'processing' | 'classified';

export default function NewComplaintScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const router = useRouter();
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [recordState, setRecordState] = useState<RecordingState>('idle');
  const [transcription, setTranscription] = useState('');
  const [classified, setClassified] = useState<{
    category: TicketCategory;
    subcategory: string;
    urgency: 1 | 2 | 3;
    flatNumber: string;
    descriptionEnglish: string;
    summaryHindi: string;
  } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>('plumbing');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;

  const handleRecordingComplete = async (uri: string, duration: number) => {
    setRecordingUri(uri);
    setRecordingDuration(duration);
    setRecordState('processing');

    let result: VoiceToTicketResult | null = null;
    try {
      const user = useAppStore.getState().user;
      result = await transcribeAndClassify(uri, user?.flat_number || 'Unknown', user?.id || 'Unknown');
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      Alert.alert('AI Processing Failed', `Could not transcribe your recording. Please try again.\n\n${message}`);
      setRecordState('idle');
      return;
    }

    setTranscription(result!.transcription);
    setClassified({
      category: result!.category,
      subcategory: result!.subcategory,
      urgency: result!.urgency,
      flatNumber: result!.flatNumber,
      descriptionEnglish: result!.descriptionEnglish,
      summaryHindi: result!.summaryHindi,
    });
    setRecordState('classified');
  };

  const handleDiscardRecording = () => {
    setRecordingUri(null);
    setRecordingDuration(0);
    setTranscription('');
    setClassified(null);
    setRecordState('idle');
  };

  const handleSubmit = () => {
    Alert.alert(
      '✅ Ticket Created!',
      'Your ticket has been created. You will receive a WhatsApp notification when a vendor is assigned.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 22, color: textPrimary }}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textPrimary }]}>New Complaint</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Mode toggle */}
          <View style={[styles.modeToggle, { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2 }]}>
            {(['voice', 'text'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, { backgroundColor: mode === m ? Colors.saffron : 'transparent' }]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.modeBtnText, { color: mode === m ? '#fff' : textSecondary }]}>
                  {m === 'voice' ? '🎤 Voice' : '✏️ Type'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'voice' ? (
            <View style={styles.voiceSection}>
              <Text style={[styles.voiceHeading, { color: textPrimary }]}>What's the issue?</Text>
              
              {recordState === 'idle' ? (
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} maxDuration={60} />
              ) : (
                <>
                  {recordState === 'processing' && (
                    <View style={[styles.processingCard, { backgroundColor: surface, borderColor: border }]}>
                      <Text style={styles.processingEmoji}>🤖</Text>
                      <Text style={[styles.processingText, { color: textPrimary }]}>AI is processing...</Text>
                      <Text style={[styles.processingSub, { color: textSecondary }]}>Transcribing and classifying your complaint</Text>
                    </View>
                  )}

                  {/* Transcription preview */}
                  {transcription && (
                    <View style={[styles.transcriptionCard, { backgroundColor: surface, borderColor: border }]}>
                      <Text style={[styles.transcriptionLabel, { color: Colors.saffron }]}>Transcription</Text>
                      <Text style={[styles.transcriptionText, { color: textSecondary }]}>{transcription}</Text>
                    </View>
                  )}

                  {/* Classified result */}
                  {classified && recordState === 'classified' && (
                    <View style={[styles.classifiedCard, { backgroundColor: surface, borderColor: Colors.successGreen + '44' }]}>
                      <Text style={[styles.classifiedTitle, { color: Colors.successGreen }]}>AI Classification</Text>
                      <View style={styles.classifiedRow}>
                        <Text style={styles.clEmoji}>{categoryMeta[classified.category].emoji}</Text>
                        <View>
                          <Text style={[styles.clCategory, { color: textPrimary }]}>{categoryMeta[classified.category].label}</Text>
                          <Text style={[styles.clSub, { color: textSecondary }]}>{classified.subcategory}</Text>
                        </View>
                        <View style={[styles.urgBadge, { backgroundColor: Colors.errorRed + '22' }]}>
                          <Text style={[styles.urgText, { color: Colors.errorRed }]}>🔴 High</Text>
                        </View>
                      </View>
                      <Text style={[styles.clDescription, { color: textSecondary }]}>{classified.descriptionEnglish}</Text>
                      <Text style={[styles.clHindi, { color: isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight }]}>{classified.summaryHindi}</Text>

                      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
                        <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.submitBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                          <Text style={styles.submitBtnText}>Submit Complaint →</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.retryBtn, { borderColor: border }]}
                        onPress={handleDiscardRecording}
                      >
                        <Text style={[styles.retryBtnText, { color: textSecondary }]}>🔄 Record Again</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={styles.textSection}>
              <Text style={[styles.voiceHeading, { color: textPrimary }]}>Describe the issue</Text>

              {/* Category picker */}
              <Text style={[styles.fieldLabel, { color: textSecondary }]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        {
                          backgroundColor: selectedCategory === cat ? Colors.saffron : (isDark ? Colors.surfaceDark : Colors.surfaceLight2),
                          borderColor: selectedCategory === cat ? Colors.saffron : border,
                        },
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text style={{ fontSize: 16 }}>{categoryMeta[cat].emoji}</Text>
                      <Text style={[styles.catChipText, { color: selectedCategory === cat ? '#fff' : textSecondary }]}>
                        {categoryMeta[cat].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={[styles.fieldLabel, { color: textSecondary }]}>Description</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: surface, borderColor: border, color: textPrimary },
                ]}
                multiline
                numberOfLines={5}
                placeholder="Describe the problem in detail..."
                placeholderTextColor={isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight}
                value={textInput}
                onChangeText={setTextInput}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitBtn, { opacity: textInput.length < 10 ? 0.5 : 1 }]}
                onPress={handleSubmit}
                disabled={textInput.length < 10}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.submitBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitBtnText}>Submit Complaint →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.md },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60, gap: 0 },
  modeToggle: {
    flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 28,
  },
  modeBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  modeBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  voiceSection: { alignItems: 'center', gap: 20 },
  voiceHeading: {
    fontFamily: FontFamily.interBold, fontSize: FontSize['2xl'], textAlign: 'center',
  },
  transcriptionCard: {
    width: '100%', borderRadius: 14, borderWidth: 1, padding: 14, gap: 8,
  },
  transcriptionLabel: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  transcriptionText: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, lineHeight: 20 },
  classifiedCard: {
    width: '100%', borderRadius: 16, borderWidth: 1.5, padding: 16, gap: 12,
  },
  classifiedTitle: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.sm },
  classifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clEmoji: { fontSize: 28 },
  clCategory: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base },
  clSub: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, marginTop: 2 },
  urgBadge: { marginLeft: 'auto', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  urgText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.xs },
  clDescription: { fontFamily: FontFamily.interRegular, fontSize: FontSize.sm, lineHeight: 20 },
  clHindi: { fontFamily: FontFamily.interRegular, fontSize: FontSize.xs, fontStyle: 'italic' },
  textSection: { gap: 0 },
  fieldLabel: { fontFamily: FontFamily.interMedium, fontSize: FontSize.sm, marginBottom: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  catChipText: { fontFamily: FontFamily.interMedium, fontSize: FontSize.sm },
  textArea: {
    borderRadius: 14, borderWidth: 1, padding: 14,
    fontFamily: FontFamily.interRegular, fontSize: FontSize.base,
    lineHeight: 22, minHeight: 120, marginBottom: 20,
  },
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitBtnGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { fontFamily: FontFamily.interSemiBold, fontSize: FontSize.base, color: '#fff', letterSpacing: 0.3 },
  processingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  processingEmoji: {
    fontSize: 48,
  },
  processingText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.lg,
  },
  processingSub: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
  },
  retryBtn: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  retryBtnText: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
  },
});
