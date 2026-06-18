import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bot, Send, Leaf } from 'lucide-react-native';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "What is causing climate change in Nigeria?",
  "How does the Paris Agreement work?",
  "What can I do to reduce my carbon footprint?",
  "Explain ocean acidification simply",
];

const ERROR_MSG = "I'm having trouble connecting right now. Try again in a moment.";

export default function Mentor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const awardedPoints = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  // Online indicator dot animation
  const dotOpacity = useSharedValue(0.3);
  useEffect(() => {
    dotOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 800 }), withTiming(0.3, { duration: 800 })),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  // Typing dot animations
  const dot1Scale = useSharedValue(0.8);
  const dot2Scale = useSharedValue(0.8);
  const dot3Scale = useSharedValue(0.8);

  useEffect(() => {
    dot1Scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 300 }), withTiming(0.8, { duration: 300 })),
      -1,
      false
    );
    const t2 = setTimeout(() => {
      dot2Scale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 300 }), withTiming(0.8, { duration: 300 })),
        -1,
        false
      );
    }, 150);
    const t3 = setTimeout(() => {
      dot3Scale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 300 }), withTiming(0.8, { duration: 300 })),
        -1,
        false
      );
    }, 300);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const animatedDot1 = useAnimatedStyle(() => ({ transform: [{ scale: dot1Scale.value }] }));
  const animatedDot2 = useAnimatedStyle(() => ({ transform: [{ scale: dot2Scale.value }] }));
  const animatedDot3 = useAnimatedStyle(() => ({ transform: [{ scale: dot3Scale.value }] }));

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || isLoading) return;

    const userMsg: ChatMsg = { role: 'user', content: trimmed };
    const newHistory = [...messages, userMsg].slice(-10);
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Award points on first message of session
    if (!awardedPoints.current) {
      awardedPoints.current = true;
      try {
        await (supabase.rpc as any)('award_mentor_points');
      } catch {
        // silent fail
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-mentor', {
        body: { messages: newHistory.map((m) => ({ role: m.role, content: m.content })) },
      });

      const payload: any = data ?? (error as any)?.context?.body ?? null;
      const reply = payload?.reply;
      const errMsg = payload?.error;

      if (reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else if (errMsg) {
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    sendMessage(inputText);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={['#0f4c2a', '#1a6b3a']} style={styles.headerIcon}>
            <Bot size={20} color="#fff" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Climate Mentor</Text>
            <Text style={styles.headerSubtitle}>Ask anything about climate change</Text>
          </View>
        </View>
        <View style={styles.onlinePill}>
          <Animated.View style={[styles.onlineDot, dotStyle]} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatArea}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Leaf size={32} color="#fff" />
              </View>
              <Text style={styles.emptyTitle}>Hi! I'm your Climate Mentor.</Text>
              <Text style={styles.emptySubtitle}>Ask me anything about our planet.</Text>

              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionBtn}
                    onPress={() => sendMessage(s)}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.assistantIcon}>
                  <Leaf size={12} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.assistantIcon}>
                <Leaf size={12} color="#fff" />
              </View>
              <View style={styles.typingContainer}>
                <Animated.View style={[styles.typingDot, animatedDot1]} />
                <Animated.View style={[styles.typingDot, animatedDot2]} />
                <Animated.View style={[styles.typingDot, animatedDot3]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about climate change..."
            placeholderTextColor="#166534"
            value={inputText}
            onChangeText={setInputText}
            maxLength={500}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a3a28',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {},
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  headerSubtitle: {
    color: '#86efac',
    fontSize: 12,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#052e16',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#166534',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  onlineText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0f4c2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#86efac',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  suggestions: {
    width: '100%',
    gap: 10,
  },
  suggestionBtn: {
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: '#166534',
  },
  suggestionText: {
    color: '#86efac',
    fontSize: 13,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#22c55e',
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  assistantIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0f4c2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#f0fdf4',
    flex: 1,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a3a28',
    backgroundColor: '#0a1f10',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#22c55e',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
