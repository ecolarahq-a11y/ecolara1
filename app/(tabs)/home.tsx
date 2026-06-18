import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProgress } from '@/hooks/useUserProgress';
import { modules } from '@/data/modules';
import { badges } from '@/data/badges';
import { Flame, Star, BookOpen, ChevronRight, Globe } from 'lucide-react-native';

const LEVEL_THRESHOLDS = [0, 30, 60, 100, 140, 190, 250, 320, 400, 500, 999];

export default function Home() {
  const { progress, callStreak } = useUserProgress();
  const router = useRouter();

  useEffect(() => {
    callStreak();
  }, [callStreak]);

  const nextModule = modules.find(m => !progress.completedModules.includes(m.id)) || modules[0];
  const completionPct = Math.round((progress.completedModules.length / modules.length) * 100);

  const currentThreshold = LEVEL_THRESHOLDS[progress.level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[progress.level] || 999;
  const levelPct = Math.min(
    Math.round(((progress.totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100),
    100
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={['#0f4c2a', '#1a6b3a']} style={styles.headerLogoBg}>
            <Globe size={18} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>ECOLARA</Text>
            <Text style={styles.headerSubtitle}>AI Climate Education</Text>
          </View>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{progress.name} 👋</Text>

          <View style={styles.chipRow}>
            <View style={[styles.chip, { backgroundColor: '#422006' }]}>
              <Star size={14} color="#fbbf24" />
              <Text style={[styles.chipText, { color: '#fbbf24' }]}>Level {progress.level}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: '#431407' }]}>
              <Flame size={14} color="#f97316" />
              <Text style={[styles.chipText, { color: '#f97316' }]}>
                {progress.streak > 0 ? `${progress.streak} day streak` : 'Start streak!'}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: '#052e16' }]}>
              <Text style={[styles.chipText, { color: '#22c55e' }]}>💚 {progress.totalPoints} pts</Text>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.levelProgress}>
            <View style={styles.levelLabels}>
              <Text style={styles.levelLabelText}>Level {progress.level}</Text>
              <Text style={styles.levelLabelText}>Level {Math.min(progress.level + 1, 10)}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${levelPct}%` }]} />
            </View>
          </View>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTINUE LEARNING</Text>
          <TouchableOpacity onPress={() => router.push(`/module/${nextModule.id}`)}>
            <LinearGradient
              colors={['#0f4c2a', '#1a6b3a']}
              style={styles.continueCard}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleLabel}>Module {nextModule.id}</Text>
                <Text style={styles.moduleTitle}>{nextModule.title}</Text>
                <Text style={styles.moduleDesc}>{nextModule.description}</Text>
                <View style={styles.startRow}>
                  <BookOpen size={16} color="#22c55e" />
                  <Text style={styles.startText}>Start Learning</Text>
                </View>
              </View>
              <Text style={{ fontSize: 40 }}>{nextModule.icon}</Text>
              <ChevronRight size={14} color="#22c55e" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR PROGRESS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress.completedModules.length}/{modules.length}</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#fbbf24' }]}>{progress.earnedBadges.length}/{badges.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#38bdf8' }]}>{completionPct}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </View>

        {/* All Modules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>ALL MODULES</Text>
            <TouchableOpacity onPress={() => router.push('/learn')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {modules.map(m => {
            const completed = progress.completedModules.includes(m.id);
            const score = progress.quizScores[m.id];
            return (
              <TouchableOpacity
                key={m.id}
                style={styles.moduleCard}
                onPress={() => router.push(`/module/${m.id}`)}
              >
                <Text style={{ fontSize: 28 }}>{m.icon}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.moduleCardTitle}>{m.title}</Text>
                  <Text style={styles.moduleCardStatus}>
                    {completed ? `✅ Done • ${score}%` : 'Not started'}
                  </Text>
                </View>
                <ChevronRight size={16} color="#166534" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a1f10',
    gap: 10,
  },
  headerLogoBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerSubtitle: {
    color: '#22c55e',
    fontSize: 11,
  },
  welcomeCard: {
    margin: 16,
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  welcomeLabel: {
    color: '#86efac',
    fontSize: 13,
  },
  welcomeName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelProgress: {
    marginTop: 14,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelLabelText: {
    color: '#22c55e',
    fontSize: 11,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#052e16',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  viewAllText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '500',
  },
  continueCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleLabel: {
    color: '#86efac',
    fontSize: 11,
  },
  moduleTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  moduleDesc: {
    color: '#86efac',
    fontSize: 12,
    marginTop: 6,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  startText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#22c55e',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#86efac',
    fontSize: 11,
    marginTop: 4,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  moduleCardTitle: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  moduleCardStatus: {
    color: '#166534',
    fontSize: 12,
    marginTop: 2,
  },
});
