import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Square, MailCheck, Globe } from 'lucide-react-native';
import { supabase } from '@/integrations/supabase/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon() {
  return (
    <View style={{ width: 18, height: 18 }}>
      <View style={{ position: 'absolute', width: 18, height: 18 }}>
        <Text style={{ fontSize: 18 }}>G</Text>
      </View>
    </View>
  );
}

export default function Auth() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [isLogin, setIsLogin] = useState(params.mode !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const { signIn, signUp, resendVerification } = useAuth();
  const router = useRouter();

  const validate = () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!isLogin && !displayName.trim()) e.name = 'Display name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setPendingEmail(email.trim());
          Alert.alert('Verify your email', 'Please confirm your email to log in.');
        } else {
          setErrors({ email: error.message });
        }
      } else {
        router.replace('/(tabs)/home');
      }
    } else {
      const { error, alreadyRegistered, needsConfirmation } = await signUp(email.trim(), password, displayName.trim());
      if (error) {
        setErrors({ email: error.message });
      } else if (alreadyRegistered) {
        Alert.alert('Email already registered', 'This email is already in use. Switched to login.');
        setIsLogin(true);
        setPassword('');
      } else {
        setPendingEmail(email.trim());
      }
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    const { error } = await resendVerification(pendingEmail);
    setResending(false);
    if (error) {
      Alert.alert('Could not resend', error.message);
    } else {
      Alert.alert('Verification email sent', `Check your inbox at ${pendingEmail}`);
    }
  };

  const handleGoogle = async () => {
    const { lovable } = await import('@/integrations/lovable');
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
    });
    if (result.error) {
      Alert.alert('Google sign-in failed', result.error.message);
      return;
    }
    if (result.redirected) return;
    router.replace('/(tabs)/home');
  };


  if (pendingEmail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pendingCard}>
          <MailCheck size={48} color="#22c55e" />
          <Text style={styles.pendingTitle}>Check your inbox</Text>
          <Text style={styles.pendingText}>
            We sent a verification link to{' '}
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{pendingEmail}</Text>
          </Text>
          <Text style={styles.pendingSubtext}>
            Click the link to activate your account, then log in.
          </Text>

          <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={resending}>
            {resending ? (
              <ActivityIndicator color="#86efac" size="small" />
            ) : (
              <Text style={styles.resendText}>Resend email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setPendingEmail(null); setIsLogin(true); }}>
            <Text style={styles.backLink}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color="#22c55e" />
            </TouchableOpacity>
            <LinearGradient colors={['#0f4c2a', '#1a6b3a']} style={styles.logoContainer}>
              <Globe size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join the Mission'}</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Continue your climate journey' : 'Start your climate education journey'}
            </Text>
          </View>

          <View style={styles.formCard}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <View style={styles.inputRow}>
                  <User size={18} color="#22c55e" />
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor="#166534"
                    value={displayName}
                    onChangeText={setDisplayName}
                    maxLength={50}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Mail size={18} color="#22c55e" />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#166534"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Lock size={18} color="#22c55e" />
                <TextInput
                  style={styles.input}
                  placeholder={isLogin ? 'Password' : 'Create a password'}
                  placeholderTextColor="#166534"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={18} color="#22c55e" />
                  ) : (
                    <Eye size={18} color="#22c55e" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {isLogin && (
              <View style={styles.rememberRow}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Square size={14} color="#166534" />
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/forgot-password' as any)}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{isLogin ? 'Log In' : 'Create Account'}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogle}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>G</Text>
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setErrors({}); }}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2818',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#86efac',
    textAlign: 'center',
    marginTop: 4,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1a3a28',
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#166534',
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    marginLeft: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rememberText: {
    color: '#86efac',
    fontSize: 12,
  },
  forgotText: {
    color: '#22c55e',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#22c55e',
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1a3a28',
  },
  dividerText: {
    color: '#166534',
    fontSize: 12,
    marginHorizontal: 12,
  },
  googleButton: {
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#166534',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  googleText: {
    color: '#ffffff',
    fontSize: 14,
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  toggleText: {
    color: '#22c55e',
    fontSize: 14,
  },
  pendingCard: {
    margin: 16,
    backgroundColor: '#1a3a28',
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
    alignItems: 'center',
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#86efac',
    textAlign: 'center',
    marginTop: 12,
  },
  pendingSubtext: {
    fontSize: 12,
    color: '#166534',
    textAlign: 'center',
    marginTop: 8,
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },
  resendText: {
    color: '#86efac',
    fontSize: 14,
  },
  backLink: {
    color: '#22c55e',
    fontSize: 14,
    marginTop: 16,
  },
});
