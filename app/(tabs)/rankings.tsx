import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal } from 'lucide-react-native';

interface LeaderboardEntry {
  name: string;
  points: number;
  level: number;
  user_id: string;
}

export default function Rankings() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        // Use the RPC function
        const { data, error: rpcError } = await (supabase.rpc as any)('get_leaderboard');
        if (rpcError) {
          setError(true);
          setLoading(false);
          return;
        }

        const list: LeaderboardEntry[] = (data as any[]).map((r: any) => ({
          name: r.display_name || 'Eco Learner',
          points: r.total_points,
          level: r.level,
          user_id: r.user_id,
        }));
        setEntries(list);

        if (user) {
          const idx = list.findIndex((e) => e.user_id === user.id);
          setMyRank(idx >= 0 ? idx + 1 : null);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    };

    loadLeaderboard();
  }, [user]);

  const rankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy size={24} color="#fbbf24" />;
    }
    if (rank === 2) {
      return <Medal size={24} color="#9ca3af" />;
    }
    if (rank === 3) {
      return <Medal size={24} color="#d97706" />;
    }
    return (
      <Text style={styles.rankNumber}>#{rank}</Text>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Climate Champions</Text>
          <Text style={styles.subtitle}>Global Rankings</Text>
        </View>
        {myRank !== null && (
          <View style={styles.rankPill}>
            <Text style={styles.rankPillText}>#{myRank} — Your Rank</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingText}>Loading rankings...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Could not load leaderboard.</Text>
            <Text style={styles.errorSubtext}>Check your connection and try again.</Text>
          </View>
        )}

        {!loading && !error && entries && entries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data yet.</Text>
            <Text style={styles.emptySubtext}>Be the first to earn EcoPoints!</Text>
          </View>
        )}

        {!loading && !error && entries && entries.length > 0 && (
          <View style={styles.list}>
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = user && entry.user_id === user.id;

              return (
                <View
                  key={entry.user_id}
                  style={[
                    styles.entryCard,
                    isCurrentUser && styles.entryCardHighlight,
                  ]}
                >
                  {/* Rank */}
                  <View style={styles.rankColumn}>
                    {rankIcon(rank)}
                  </View>

                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{entry.name}</Text>
                    <Text style={styles.userLevel}>Level {entry.level}</Text>
                  </View>

                  {/* Points */}
                  <View style={styles.pointsColumn}>
                    <Text style={styles.pointsValue}>{entry.points}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
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
  rankPill: {
    backgroundColor: '#052e16',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rankPillText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    color: '#86efac',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#86efac',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#86efac',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a28',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  entryCardHighlight: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
    backgroundColor: 'rgba(5, 46, 22, 0.4)',
  },
  rankColumn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    color: '#166534',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  userLevel: {
    color: '#166534',
    fontSize: 12,
    marginTop: 2,
  },
  pointsColumn: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pointsLabel: {
    color: '#166534',
    fontSize: 11,
  },
});
