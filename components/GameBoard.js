import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import WordInputCell, { FEEDBACK_COLORS } from './WordInputCell';
import { WORD_FAMILIES, isRelatedWord } from '../data/wordFamilies';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 375;

const PARTS_OF_SPEECH = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB'];
const PART_KEYS = ['noun', 'verb', 'adjective', 'adverb'];

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentFamily, setCurrentFamily] = useState(null);
  const [inputs, setInputs] = useState({ noun: '', verb: '', adjective: '', adverb: '' });
  const [feedback, setFeedback] = useState({});
  const [gameWon, setGameWon] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState({ noun: [], verb: [], adjective: [], adverb: [] });

  useEffect(() => {
    if (difficulty && !currentFamily) {
      startNewRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const startNewRound = useCallback(() => {
    const families = WORD_FAMILIES[difficulty];
    const randomFamily = families[Math.floor(Math.random() * families.length)];
    
    setCurrentFamily(randomFamily);
    setInputs({ noun: '', verb: '', adjective: '', adverb: '' });
    setFeedback({});
    setGameWon(false);
    setRevealedLetters({ noun: [], verb: [], adjective: [], adverb: [] });
  }, [difficulty]);

  const handleNext = () => {
    setRound(round + 1);
    startNewRound();
  };

  const handleBack = () => {
    setDifficulty(null);
    setCurrentFamily(null);
    setInputs({ noun: '', verb: '', adjective: '', adverb: '' });
    setFeedback({});
    setGameWon(false);
    setRound(1);
    setScore(0);
    setRevealedLetters({ noun: [], verb: [], adjective: [], adverb: [] });
  };

  const handleInputChange = (part, value) => {
    if (gameWon) return;
    
    setInputs(prev => ({
      ...prev,
      [part]: value
    }));
    // Clear feedback for this field when user starts typing
    setFeedback(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[part];
      return newFeedback;
    });
  };

  const checkAnswers = () => {
    if (gameWon) return;

    // Check if all four fields are filled
    const emptyFields = PART_KEYS.filter((key) => !inputs[key].trim());

    if (emptyFields.length > 0) {
      Alert.alert('Incomplete', 'Please fill in all four fields.');
      return;
    }

    const newFeedback = {};
    let allCorrect = true;

    PART_KEYS.forEach((key, index) => {
      const userAnswer = inputs[key].trim().toUpperCase();
      const correctAnswer = currentFamily[key].toUpperCase();
      const partOfSpeech = PARTS_OF_SPEECH[index];

      if (userAnswer === correctAnswer) {
        // Green: Correct
        newFeedback[key] = {
          type: 'correct',
          message: 'Correct!'
        };
      } else {
        allCorrect = false;
        
        // Check if it's a related word (wrong form)
        if (isRelatedWord(userAnswer, currentFamily)) {
          // Check if it belongs to a different part of speech
          const belongsToOtherPart = PART_KEYS.some((otherKey, otherIndex) => {
            if (otherIndex === index) return false;
            return currentFamily[otherKey].toUpperCase() === userAnswer;
          });

          if (belongsToOtherPart) {
            // Yellow: Related but wrong column
            newFeedback[key] = {
              type: 'related',
              message: `This word belongs in a different column`
            };
          } else {
            // Yellow: Valid derivation but not the primary form
            newFeedback[key] = {
              type: 'related',
              message: `Valid derivation, but not the primary ${partOfSpeech.toLowerCase()}`
            };
          }
        } else if (difficulty === 'level3' && currentFamily.requiresPrefix) {
          // Check if prefix is missing
          const root = currentFamily.root.toUpperCase();
          if (userAnswer.includes(root) || root.includes(userAnswer)) {
            // Blue: Prefix missing
            newFeedback[key] = {
              type: 'prefix_missing',
              message: `This word needs a negative prefix (un-, dis-, il-, im-)`
            };
          } else {
            // Red: Incorrect
            newFeedback[key] = {
              type: 'incorrect',
              message: 'Not a valid derivation'
            };
          }
        } else {
          // Red: Incorrect
          newFeedback[key] = {
            type: 'incorrect',
            message: 'Not a valid derivation'
          };
        }
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setGameWon(true);
      setScore(score + 1);
    }
  };

  const resetRound = () => {
    setInputs({ noun: '', verb: '', adjective: '', adverb: '' });
    setFeedback({});
    setGameWon(false);
    setRevealedLetters({ noun: [], verb: [], adjective: [], adverb: [] });
  };

  const showHint = () => {
    if (!currentFamily) return;
    
    // Find fields that aren't complete yet
    const incompleteFields = PART_KEYS.filter((key) => {
      const userInput = inputs[key].trim().toUpperCase();
      const correctAnswer = currentFamily[key].toUpperCase();
      return userInput !== correctAnswer;
    });
    
    if (incompleteFields.length === 0) return;
    
    // Pick a random incomplete field
    const hintField = incompleteFields[Math.floor(Math.random() * incompleteFields.length)];
    const correctAnswer = currentFamily[hintField].toUpperCase();
    const currentRevealed = revealedLetters[hintField] || [];
    
    // Find a letter that hasn't been revealed yet
    const availablePositions = [];
    for (let i = 0; i < correctAnswer.length; i++) {
      if (!currentRevealed.includes(i)) {
        availablePositions.push(i);
      }
    }
    
    if (availablePositions.length === 0) return; // All letters already revealed
    
    // Reveal a random letter
    const positionToReveal = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    
    setRevealedLetters(prev => ({
      ...prev,
      [hintField]: [...prev[hintField], positionToReveal]
    }));
  };


  if (!difficulty) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Derivation Dash</Text>
          <Text style={styles.subtitle}>Complete the word family</Text>
        </View>
        
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyTitle}>Select Difficulty:</Text>
          
          <TouchableOpacity 
            style={styles.difficultyButton}
            onPress={() => setDifficulty('level1')}
            activeOpacity={0.7}
          >
            <Text style={styles.difficultyButtonText}>Level 1: Basic Suffixes</Text>
            <Text style={styles.difficultyDescription}>FCE-style: Common, predictable suffixes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.difficultyButton}
            onPress={() => setDifficulty('level2')}
            activeOpacity={0.7}
          >
            <Text style={styles.difficultyButtonText}>Level 2: Irregular Forms</Text>
            <Text style={styles.difficultyDescription}>Advanced FCE/CAE: Spelling changes, multiple forms</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.difficultyButton}
            onPress={() => setDifficulty('level3')}
            activeOpacity={0.7}
          >
            <Text style={styles.difficultyButtonText}>Level 3: Negation & Prefixes</Text>
            <Text style={styles.difficultyDescription}>CAE-style: Negative prefixes required</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentFamily) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, IS_SMALL_SCREEN && styles.titleSmall]}>Derivation Dash</Text>
          <Text style={[styles.subtitle, IS_SMALL_SCREEN && styles.subtitleSmall]}>Round {round} • Score: {score}</Text>
          <Text style={[styles.instruction, IS_SMALL_SCREEN && styles.instructionSmall]}>
            Complete the word family by filling in all four forms
          </Text>
        </View>

      <View style={styles.rootContainer}>
        <Text style={styles.rootLabel}>Root Word:</Text>
        <View style={styles.rootDisplay}>
          <Text style={styles.rootText}>{currentFamily.root.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {PARTS_OF_SPEECH.map((part, index) => {
          const partKey = PART_KEYS[index];
          const value = inputs[partKey];
          const placeholder = `Enter ${part.toLowerCase()}`;
          
          return (
            <WordInputCell
              key={partKey}
              label={part}
              value={value}
              onChangeText={(text) => handleInputChange(partKey, text)}
              placeholder={placeholder}
              feedback={feedback[partKey]}
              isLocked={gameWon}
              correctAnswer={gameWon ? currentFamily[partKey] : null}
              onSubmit={checkAnswers}
              revealedLetters={revealedLetters[partKey] || []}
              correctAnswerForHint={currentFamily[partKey]}
            />
          );
        })}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Feedback Colors:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: FEEDBACK_COLORS.GREEN }]}>
            <Text style={styles.legendText}>Green: Correct</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: FEEDBACK_COLORS.YELLOW }]}>
            <Text style={styles.legendText}>Yellow: Related/Wrong Form</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: FEEDBACK_COLORS.RED }]}>
            <Text style={styles.legendText}>Red: Incorrect</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: FEEDBACK_COLORS.BLUE }]}>
            <Text style={styles.legendText}>Blue: Prefix Missing</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.checkButton]} 
          onPress={checkAnswers}
          disabled={gameWon}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetRound}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.hintButton]} 
          onPress={showHint}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Hint</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]} 
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {currentFamily.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>💡 {currentFamily.note}</Text>
        </View>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: IS_SMALL_SCREEN ? 12 : 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    minHeight: 44, // iOS minimum touch target
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  titleSmall: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  subtitleSmall: {
    fontSize: 14,
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  instructionSmall: {
    fontSize: 12,
  },
  rootContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rootLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  rootDisplay: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rootText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  difficultyContainer: {
    padding: 20,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  difficultyButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 80, // Ensure good touch target
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#666',
  },
  legend: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  legendItem: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: IS_SMALL_SCREEN ? 16 : 24,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: IS_SMALL_SCREEN ? 80 : 100,
    minHeight: 44, // iOS minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: IS_SMALL_SCREEN ? 4 : 6,
    marginVertical: 4,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  hintButton: {
    backgroundColor: '#FF9800',
  },
  nextButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
});
