import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/fonts';
import { useAppStore } from '../../lib/store';

export default function LoginScreen() {
  const isDark = useAppStore((s) => s.isDark);
  const login = useAppStore((s) => s.login);
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<TextInput[]>([]);

  const bg = isDark ? Colors.bgDark : Colors.bgLight;
  const surface = isDark ? Colors.surfaceDark : Colors.surfaceLight;
  const textPrimary = isDark ? Colors.textPrimaryDark : Colors.textPrimaryLight;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondaryLight;
  const border = isDark ? Colors.borderDark : Colors.borderLight;

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(phone);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <LinearGradient
          colors={isDark ? [Colors.bgDark, '#1A1510'] : [Colors.bgLight, '#F0EDE5']}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            {/* Logo */}
            <View style={styles.logoSection}>
              <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>⚖️</Text>
              </LinearGradient>
              <Text style={[styles.appName, { color: textPrimary }]}>AI Panchayat</Text>
              <Text style={[styles.tagline, { color: textSecondary }]}>आपकी सोसाइटी, सुलझी हुई।</Text>
              <Text style={[styles.taglineEn, { color: Colors.saffron }]}>Your society, sorted.</Text>
            </View>

            {/* Card */}
            <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
              {step === 'phone' ? (
                <>
                  <Text style={[styles.cardTitle, { color: textPrimary }]}>Enter your mobile number</Text>
                  <Text style={[styles.cardSub, { color: textSecondary }]}>We'll send a 6-digit OTP to verify</Text>

                  <View style={[styles.phoneInput, { backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2, borderColor: border }]}>
                    <View style={[styles.prefix, { borderRightColor: border }]}>
                      <Text style={[styles.prefixText, { color: Colors.saffron }]}>🇮🇳 +91</Text>
                    </View>
                    <TextInput
                      style={[styles.input, { color: textPrimary }]}
                      placeholder="98765 43210"
                      placeholderTextColor={isDark ? Colors.textTertiaryDark : Colors.textTertiaryLight}
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]}
                    onPress={handleSendOtp}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.primaryBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={styles.primaryBtnText}>{loading ? 'Sending...' : 'Send OTP →'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.cardTitle, { color: textPrimary }]}>Enter OTP</Text>
                  <Text style={[styles.cardSub, { color: textSecondary }]}>Sent to +91 {phone}</Text>

                  <View style={styles.otpRow}>
                    {otp.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={(ref) => { if (ref) otpRefs.current[i] = ref; }}
                        style={[
                          styles.otpBox,
                          { color: textPrimary, backgroundColor: isDark ? Colors.surfaceDark2 : Colors.surfaceLight2, borderColor: digit ? Colors.saffron : border },
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, i)}
                        textAlign="center"
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]}
                    onPress={handleVerify}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={[Colors.saffron, Colors.saffronDark]} style={styles.primaryBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={styles.primaryBtnText}>{loading ? 'Verifying...' : 'Verify & Enter →'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setStep('phone')} style={styles.backBtn}>
                    <Text style={{ color: textSecondary, fontFamily: FontFamily.interMedium, fontSize: FontSize.sm }}>
                      ← Change number
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Role Demo Switcher */}
            <View style={styles.demoSection}>
              <Text style={[styles.demoLabel, { color: textSecondary }]}>Demo: Switch role →</Text>
              <View style={styles.demoRow}>
                {(['resident', 'secretary'] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.demoChip, {
                      backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight,
                      borderColor: border,
                    }]}
                    onPress={() => {
                      useAppStore.getState().switchRole(r);
                      router.replace('/(tabs)');
                    }}
                  >
                    <Text style={{ color: Colors.saffron, fontFamily: FontFamily.interMedium, fontSize: FontSize.sm }}>
                      {r === 'resident' ? '👤 Resident' : '⚡ Secretary'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 28,
  },
  logoSection: {
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontFamily: FontFamily.interBold,
    fontSize: FontSize['2xl'],
  },
  tagline: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.base,
  },
  taglineEn: {
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.sm,
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  cardTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.lg,
  },
  cardSub: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.sm,
    marginTop: -8,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    height: 54,
  },
  prefix: {
    paddingHorizontal: 14,
    borderRightWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  prefixText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.md,
    height: '100%',
  },
  primaryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryBtnGrad: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSize.base,
    color: '#fff',
    letterSpacing: 0.3,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    fontFamily: FontFamily.interBold,
    fontSize: FontSize.xl,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  demoSection: {
    alignItems: 'center',
    gap: 10,
  },
  demoLabel: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.xs,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
