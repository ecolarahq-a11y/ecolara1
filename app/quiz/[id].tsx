import { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserProgress, SubmitQuizResponse } from '@/hooks/useUserProgress';
import { modules, QuizQuestion } from '@/data/modules';
import { getQuestionsForDifficulty } from '@/lib/quiz-engine';
import { ArrowLeft, Check, X, ArrowRight, Hop as Home, RotateCcw } from 'lucide-react-native';

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress, submitQuiz } = useUserProgress();

  const module = modules.find(m => m.id === Number(id));
  const difficulty = module ? (progress.currentDifficulty[module.id] || 'medium') : 'medium';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<SubmitQuizResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (module) {
      const qs = getQuestionsForDifficulty(module.questions, difficulty, 5);
      setQuestions(qs);
      setLoading(false);
    }
  }, [module, difficulty]);

  if (loading || !module || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question.correctIndex;
  const progressPct = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (idx === question.correctIndex) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Submit quiz
      setSubmitting(true);
      const result = await submitQuiz(module.id, correctCount, questions.length);
      setSubmitting(false);
      if (result) {
        setQuizResult(result);
        setShowResults(true);
      } else {
        Alert.alert('Error', 'Could not submit quiz results. Please try again.');
      }
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Leave Quiz?',
      'Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const resetQuiz = () => {
    const qs = getQuestionsForDifficulty(module.questions, difficulty, 5);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setShowResults(false);
    setQuizResult(null);
  };

  // Results View
  if (showResults && quizResult) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Text style={styles.scoreBig}>
            {quizResult.score}/{quizResult.total}
          </Text>
          <Text style={styles.scorePct}>{quizResult.percentage}%</Text>

          <View style={styles.pointsPill}>
            <Text style={styles.pointsText}>+{quizResult.pointsAwarded} EcoPoints</Text>
          </View>

          <Text style={styles.feedbackText}>{quizResult.feedbackMessage}</Text>

          {quizResult.newBadges.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeTitle}>🏆 New Badge Earned!</Text>
              {quizResult.newBadges.map((b, i) => (
                <Text key={i} style={styles.badgeName}>{b}</Text>
              ))}
            </View>
          )}

          <Text style={styles.difficultyText}>
            Next quiz: {quizResult.nextDifficulty} difficulty
          </Text>

          <View style={styles.resultsButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/home')}>
              <Home size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Go Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetQuiz}>
              <RotateCcw size={18} color="#22c55e" />
              <Text style={styles.secondaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Question View
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={20} color="#22c55e" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Question {currentIndex + 1}/{questions.length}
        </Text>
        <View style={[styles.difficultyPill, difficulty === 'easy' ? styles.easyPill : difficulty === 'medium' ? styles.mediumPill : styles.hardPill]}>
          <Text style={styles.difficultyPillText}>{difficulty}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.quizContainer}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((opt, idx) => {
            const isCorrectOption = idx === question.correctIndex;
            const isSelectedOption = idx === selectedAnswer;

            const getOptionStyle = () => {
              if (isAnswered && isCorrectOption) {
                return [styles.optionCard, styles.correctOption];
              }
              if (isAnswered && isSelectedOption && !isCorrectOption) {
                return [styles.optionCard, styles.wrongOption];
              }
              if (!isAnswered && isSelectedOption) {
                return [styles.optionCard, { borderColor: '#22c55e' }];
              }
              return styles.optionCard;
            };

            const getTextStyle = () => {
              if (isAnswered && isCorrectOption) {
                return [styles.optionText, styles.correctText];
              }
              if (isAnswered && isSelectedOption && !isCorrectOption) {
                return [styles.optionText, styles.wrongText];
              }
              return styles.optionText;
            };

            const getLetterStyle = () => {
              if (isAnswered && isCorrectOption) {
                return [styles.letterCircle, styles.correctLetter];
              }
              if (isAnswered && isSelectedOption && !isCorrectOption) {
                return [styles.letterCircle, styles.wrongLetter];
              }
              return styles.letterCircle;
            };

            return (
              <TouchableOpacity
                key={idx}
                style={getOptionStyle()}
                onPress={() => handleAnswer(idx)}
                disabled={isAnswered}
              >
                <View style={getLetterStyle()}>
                  <Text style={styles.letterText}>{String.fromCharCode(65 + idx)}</Text>
                </View>
                <Text style={getTextStyle()}>{opt}</Text>
                {isAnswered && isCorrectOption && (
                  <Check size={18} color="#22c55e" />
                )}
                {isAnswered && isSelectedOption && !isCorrectOption && (
                  <X size={18} color="#ef4444" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {isAnswered && (
          <View style={[styles.explanationCard, isCorrect ? styles.correctExplanation : styles.wrongExplanation]}>
            <Text style={[styles.explanationTitle, isCorrect ? styles.correctExplanationTitle : styles.wrongExplanationTitle]}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

        {/* Next/Results Button */}
        {isAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Submitting Overlay */}
      {submitting && (
        <View style={styles.submittingOverlay}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.submittingText}>Saving results...</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#86efac',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerText: {
    color: '#86efac',
    fontSize: 14,
    flex: 1,
  },
  difficultyPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  easyPill: {
    backgroundColor: '#052e16',
  },
  mediumPill: {
    backgroundColor: '#422006',
  },
  hardPill: {
    backgroundColor: '#3f0f0f',
  },
  difficultyPillText: {
    color: '#86efac',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#052e16',
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  quizContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(20, 83, 45, 0.5)',
  },
  questionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsContainer: {
    marginTop: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a28',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 83, 45, 0.5)',
    gap: 12,
  },
  correctOption: {
    backgroundColor: '#052e16',
    borderColor: '#22c55e',
  },
  wrongOption: {
    backgroundColor: '#3f0f0f',
    borderColor: '#ef4444',
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0a1f10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctLetter: {
    backgroundColor: '#22c55e',
  },
  wrongLetter: {
    backgroundColor: '#ef4444',
  },
  letterText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 15,
    flex: 1,
  },
  correctText: {
    color: '#22c55e',
  },
  wrongText: {
    color: '#ef4444',
  },
  explanationCard: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
  },
  correctExplanation: {
    backgroundColor: '#052e16',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  wrongExplanation: {
    backgroundColor: '#3f0f0f',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  explanationTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  correctExplanationTitle: {
    color: '#22c55e',
  },
  wrongExplanationTitle: {
    color: '#ef4444',
  },
  explanationText: {
    color: '#86efac',
    fontSize: 13,
    lineHeight: 19,
  },
  nextButton: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    height: 52,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  scoreBig: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: 'bold',
  },
  scorePct: {
    color: '#22c55e',
    fontSize: 28,
    marginTop: 4,
  },
  pointsPill: {
    backgroundColor: '#422006',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
  },
  pointsText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackText: {
    color: '#86efac',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 32,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeTitle: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 16,
  },
  badgeName: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
  },
  difficultyText: {
    color: '#166534',
    fontSize: 13,
    marginTop: 12,
  },
  resultsButtons: {
    marginTop: 32,
    paddingHorizontal: 24,
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#166534',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
  },
  secondaryButtonText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
  submittingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 40, 24, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittingText: {
    color: '#86efac',
    marginTop: 12,
  },
});
