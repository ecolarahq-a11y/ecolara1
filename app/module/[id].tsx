import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserProgress } from '@/hooks/useUserProgress';
import { modules } from '@/data/modules';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play } from 'lucide-react-native';

export default function ModuleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress } = useUserProgress();

  const module = modules.find(m => m.id === Number(id));

  useEffect(() => {
    if (id) {
      (supabase.rpc as any)('complete_mission', { p_mission_number: 3 }).catch(() => {});
    }
  }, [id]);

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Module not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const completed = progress.completedModules.includes(module.id);
  const score = progress.quizScores[module.id];
  const difficulty = progress.currentDifficulty[module.id] || 'medium';

  // Parse and render content
  const renderContent = () => {
    const lines = module.content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // Section heading
        const text = trimmed.slice(2, -2);
        elements.push(
          <Text key={index} style={styles.heading}>
            {text}
          </Text>
        );
      } else if (trimmed.startsWith('•')) {
        // Bullet point
        elements.push(
          <View key={index} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{trimmed.slice(1).trim()}</Text>
          </View>
        );
      } else if (trimmed === '') {
        // Spacer
        elements.push(<View key={index} style={{ height: 8 }} />);
      } else {
        // Regular paragraph
        elements.push(
          <Text key={index} style={styles.paragraph}>
            {trimmed}
          </Text>
        );
      }
    });

    return elements;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#22c55e" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.moduleIcon}>{module.icon}</Text>
          <Text style={styles.moduleLabel}>Module {module.id}</Text>
          <Text style={styles.title}>{module.title}</Text>
          <Text style={styles.source}>Source: {module.source}</Text>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>{renderContent()}</View>

        {/* Quiz Button */}
        <View style={styles.buttonContainer}>
          {completed && score !== undefined && (
            <Text style={styles.bestScore}>Best score: {score}%</Text>
          )}

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push(`/quiz/${module.id}`)}
          >
            <Play size={18} color="#fff" />
            <Text style={styles.quizButtonText}>
              {completed ? `Retake Quiz (${difficulty})` : 'Take the Quiz'}
            </Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#86efac',
    fontSize: 16,
  },
  backLink: {
    color: '#22c55e',
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 16,
    top: 8,
  },
  backText: {
    color: '#22c55e',
    fontSize: 14,
  },
  moduleIcon: {
    fontSize: 48,
    marginTop: 16,
  },
  moduleLabel: {
    color: '#22c55e',
    fontSize: 12,
    marginTop: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  source: {
    color: '#166534',
    fontSize: 11,
    marginTop: 4,
  },
  contentCard: {
    margin: 16,
    marginTop: 20,
    backgroundColor: '#1a3a28',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  heading: {
    color: '#86efac',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginTop: 8,
  },
  bulletText: {
    color: '#f0fdf4',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  paragraph: {
    color: '#f0fdf4',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  bestScore: {
    color: '#22c55e',
    fontSize: 14,
    marginBottom: 12,
  },
  quizButton: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 52,
  },
  quizButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
