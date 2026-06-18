import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProgress } from '@/hooks/useUserProgress';
import { badges } from '@/data/badges';
import { ArrowLeft } from 'lucide-react-native';

export default function Badges() {
  const { progress } = useUserProgress();
  const router = useRouter();

  const earnedCount = progress.earnedBadges.length;
  const totalCount = badges.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#22c55e" />
        </TouchableOpacity>
        <Text style={styles.title}>Climate Badges</Text>
        <Text style={styles.subtitle}>{earnedCount}/{totalCount} badges earned</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {badges.map(badge => {
          const earned = progress.earnedBadges.includes(badge.id);

          return (
            <View
              key={badge.id}
              style={[
                styles.badgeCard,
                earned ? styles.earnedBadge : styles.lockedBadge,
              ]}
            >
              <Text style={[styles.badgeIcon, !earned && styles.lockedIcon]}>
                {badge.icon}
              </Text>
              <Text style={[styles.badgeName, !earned && styles.lockedText]}>
                {badge.name}
              </Text>
              <Text style={[styles.badgeDesc, !earned && styles.lockedText]}>
                {badge.description}
              </Text>
              {earned ? (
                <Text style={styles.earnedText}>✓ Earned</Text>
              ) : (
                <Text style={styles.criteriaText}>{badge.criteria}</Text>
              )}
            </View>
          );
        })}
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#86efac',
    fontSize: 14,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#1a3a28',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  earnedBadge: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  lockedBadge: {
    borderColor: 'transparent',
    opacity: 0.45,
  },
  badgeIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  lockedIcon: {
    // opacity handled by parent
  },
  badgeName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  badgeDesc: {
    color: '#86efac',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  lockedText: {
    color: '#166534',
  },
  earnedText: {
    color: '#22c55e',
    fontSize: 11,
    marginTop: 8,
  },
  criteriaText: {
    color: '#166534',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },
});
