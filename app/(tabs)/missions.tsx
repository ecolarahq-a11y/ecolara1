import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Check, Circle } from 'lucide-react-native';

interface MissionRow {
  mission_1_done: boolean;
  mission_2_done: boolean;
  mission_3_done: boolean;
}

const MISSIONS = [
  { n: 1, title: 'Complete a quiz today', reward: 15, cta: null },
  { n: 2, title: 'Score above 70% on a quiz', reward: 20, cta: null },
  { n: 3, title: 'Read any module today', reward: 10, cta: 'learn' },
];

export default function Missions() {
  const { user } = useAuth();
  const router = useRouter();
  const [row, setRow] = useState<MissionRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await (supabase.rpc as any)('get_or_create_daily_missions');
      if (!error && data) {
        setRow(data as MissionRow);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const isDone = (n: number) => row ? (row as any)[`mission_${n}_done`] as boolean : false;
  const completedCount = row ? [1, 2, 3].filter(n => isDone(n)).length : 0;
  const earnedToday = row
    ? MISSIONS.reduce((sum, m) => sum + (isDone(m.n) ? m.reward : 0), 0)
    : 0;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Eco Missions</Text>
          <Text style={styles.subtitle}>Resets daily at midnight</Text>
        </View>
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{today}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Mission Cards */}
        <View style={styles.missionsContainer}>
          {MISSIONS.map(m => {
            const done = isDone(m.n);
            const hasCta = m.cta !== null;

            return (
              <View
                key={m.n}
                style={[styles.missionCard, done && styles.missionCardDone]}
              >
                {/* Checkbox */}
                <View style={done ? styles.checkboxDone : styles.checkbox}>
                  {done ? (
                    <Check size={20} color="#fff" />
                  ) : (
                    <Circle size={28} color="#166534" />
                  )}
                </View>

                {/* Content */}
                <View style={styles.missionContent}>
                  <Text style={styles.missionTitle}>{m.title}</Text>
                  <Text style={styles.missionReward}>+{m.reward} pts</Text>
                </View>

                {/* Action */}
                <View style={styles.missionAction}>
                  {done ? (
                    <Text style={styles.doneText}>Done ✓</Text>
                  ) : hasCta ? (
                    <TouchableOpacity onPress={() => router.push('/learn')}>
                      <Text style={styles.ctaText}>Go to Learn →</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.autoText}>Complete a quiz{'\n'}to unlock</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabelText}>{completedCount}/3 missions today</Text>
            <Text style={styles.progressPoints}>{earnedToday} pts earned</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(completedCount / 3) * 100}%` }]} />
          </View>
        </View>
      </ScrollView>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#86efac',
    fontSize: 13,
    marginTop: 2,
  },
  datePill: {
    backgroundColor: '#052e16',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  missionsContainer: {
    padding: 16,
    gap: 12,
  },
  missionCard: {
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 83, 45, 0.25)',
  },
  missionCardDone: {
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  checkbox: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionContent: {
    flex: 1,
  },
  missionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  missionReward: {
    color: '#fbbf24',
    fontSize: 12,
    marginTop: 2,
  },
  missionAction: {
    alignItems: 'flex-end',
  },
  doneText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ctaText: {
    color: '#22c55e',
    fontSize: 13,
  },
  autoText: {
    color: '#166534',
    fontSize: 11,
    textAlign: 'right',
  },
  progressCard: {
    margin: 16,
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressPoints: {
    color: '#86efac',
    fontSize: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#052e16',
    borderRadius: 4,
    marginTop: 12,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 40, 24, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
