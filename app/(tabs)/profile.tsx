import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/hooks/useAuth';
import { modules } from '@/data/modules';
import { badges } from '@/data/badges';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Flame, Zap, Award, ArrowLeft, RotateCcw, LogOut } from 'lucide-react-native';

export default function Profile() {
  const { progress, setName, resetProgress } = useUserProgress();
  const { signOut } = useAuth();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setEditingName(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#0f4c2a', '#1a6b3a']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {progress.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          {!editingName ? (
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{progress.name}</Text>
              <TouchableOpacity onPress={() => { setNameInput(progress.name); setEditingName(true); }}>
                <Text style={styles.editText}>Edit name</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                maxLength={50}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingName(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Star size={24} color="#fbbf24" />
            <Text style={styles.statValue}>Level {progress.level}</Text>
            <Text style={styles.statLabel}>Current Level</Text>
          </View>
          <View style={styles.statCard}>
            <Flame size={24} color="#f97316" />
            <Text style={styles.statValue}>{progress.streak} days</Text>
            <Text style={styles.statLabel}>Daily Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Zap size={24} color="#22c55e" />
            <Text style={styles.statValue}>{progress.totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={24} color="#fbbf24" />
            <Text style={styles.statValue}>{progress.earnedBadges.length}/{badges.length}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
        </View>

        {/* Quiz Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiz Scores</Text>
          {modules.map(m => {
            const score = progress.quizScores[m.id];
            return (
              <View key={m.id} style={styles.scoreCard}>
                <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                <Text style={styles.scoreModuleName}>{m.title}</Text>
                <Text style={[styles.scoreValue, score !== undefined ? styles.scoreDone : styles.scoreNotDone]}>
                  {score !== undefined ? `${score}%` : '—'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.badgesButton} onPress={() => router.push('/badges')}>
            <Text style={styles.badgesButtonText}>View All Badges</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <RotateCcw size={18} color="#fca5a5" />
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={18} color="#22c55e" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  headerCard: {
    margin: 16,
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  nameText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editText: {
    color: '#22c55e',
    fontSize: 12,
    marginTop: 4,
  },
  editContainer: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  nameInput: {
    color: '#ffffff',
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#166534',
    width: '80%',
    textAlign: 'center',
    paddingVertical: 8,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#86efac',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 16,
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#86efac',
    fontSize: 11,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  scoreModuleName: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreDone: {
    color: '#22c55e',
  },
  scoreNotDone: {
    color: '#166534',
  },
  actions: {
    margin: 16,
    gap: 10,
  },
  badgesButton: {
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 20,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesButtonText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 20,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetButtonText: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 20,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutButtonText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
});
