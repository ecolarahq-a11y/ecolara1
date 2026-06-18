import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProgress } from '@/hooks/useUserProgress';
import { modules } from '@/data/modules';

export default function Learn() {
  const { progress } = useUserProgress();
  const router = useRouter();

  const completedCount = progress.completedModules.length;
  const totalCount = modules.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Climate Modules</Text>
          <Text style={styles.subtitle}>Your learning journey</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>{completedCount}/{totalCount} modules completed</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        {/* Modules List */}
        <View style={styles.modulesContainer}>
          {modules.map(m => {
            const completed = progress.completedModules.includes(m.id);
            const score = progress.quizScores[m.id];

            return (
              <TouchableOpacity
                key={m.id}
                style={styles.moduleCard}
                onPress={() => router.push(`/module/${m.id}`)}
              >
                <View style={styles.moduleTop}>
                  <Text style={styles.moduleIcon}>{m.icon}</Text>
                  {completed && score !== undefined && (
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{score}%</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.moduleTitle}>{m.title}</Text>
                <Text style={styles.moduleDesc}>{m.description}</Text>
                <View style={styles.moduleBottom}>
                  <Text style={styles.moduleId}>Module {m.id}</Text>
                  <View style={[styles.statusPill, completed ? styles.statusDone : styles.statusPending]}>
                    <Text style={[styles.statusText, completed ? styles.statusTextDone : styles.statusTextPending]}>
                      {completed ? '✓ Complete' : 'Not started'}
                    </Text>
                  </View>
                </View>
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
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
  progressCard: {
    margin: 16,
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 16,
  },
  progressText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#052e16',
    borderRadius: 4,
    marginTop: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  modulesContainer: {
    padding: 16,
    gap: 12,
  },
  moduleCard: {
    backgroundColor: '#1a3a28',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  moduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  moduleIcon: {
    fontSize: 40,
  },
  scoreBadge: {
    backgroundColor: '#052e16',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  moduleTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
  },
  moduleDesc: {
    color: '#86efac',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  moduleBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  moduleId: {
    color: '#166534',
    fontSize: 11,
  },
  statusPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDone: {
    backgroundColor: '#052e16',
  },
  statusPending: {
    backgroundColor: '#0a1f10',
  },
  statusText: {
    fontSize: 11,
  },
  statusTextDone: {
    color: '#22c55e',
  },
  statusTextPending: {
    color: '#166534',
  },
});
