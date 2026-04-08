import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/fonts';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  maxDuration?: number; // In seconds
}

export function VoiceRecorder({ onRecordingComplete, maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
    })();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recording) stopRecording();
    };
  }, []);

  const startPulse = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800 }),
        withTiming(0.2, { duration: 800 })
      ),
      -1,
      true
    );
  };

  const stopPulse = () => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    scale.value = withTiming(1);
    opacity.value = withTiming(0);
  };

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setDuration(0);
      startPulse();

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      stopPulse();
      
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const finalDuration = duration;

      if (uri) {
        onRecordingComplete(uri, finalDuration);
      }
      
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.2 }],
    opacity: opacity.value,
  }));

  const animatedRing2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.4 }],
    opacity: opacity.value * 0.5,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, { color: isRecording ? '#EF4444' : Colors.saffron }]}>
        {isRecording ? `⏺ ${formatTime(duration)}` : 'Tap to start speaking'}
      </Text>
      <Text style={styles.subText}>
        {isRecording ? 'Listening carefully... Tap to stop' : 'AI will analyze your voice automatically'}
      </Text>

      <View style={styles.micWrapper}>
        {isRecording && (
          <>
            <Animated.View style={[styles.pulseRing, animatedRingStyle]} />
            <Animated.View style={[styles.pulseRing2, animatedRing2Style]} />
          </>
        )}
        
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.85}
        >
          <Animated.View style={[animatedMicStyle]}>
            <LinearGradient
              colors={isRecording ? ['#EF4444', '#B91C1C'] : [Colors.saffron, Colors.saffronDark]}
              style={styles.micButton}
            >
              <View style={styles.innerCircle}>
                <Text style={styles.micEmoji}>{isRecording ? '⏹' : '🎤'}</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
    width: '100%',
  },
  timer: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  subText: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  micWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.saffron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micEmoji: {
    fontSize: 36,
    color: '#fff',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.saffron,
    zIndex: -1,
  },
  pulseRing2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.saffron,
    zIndex: -2,
  },
});
