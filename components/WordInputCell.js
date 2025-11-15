import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 375;

// Feedback colors
export const FEEDBACK_COLORS = {
  GREEN: '#4CAF50',    // Correct
  YELLOW: '#FFC107',   // Related/Wrong Form
  RED: '#F44336',      // Incorrect
  BLUE: '#2196F3',     // Prefix/Suffix Missing
  DEFAULT: '#FFFFFF'   // Default/No feedback
};

export default function WordInputCell({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  feedback, 
  isLocked,
  correctAnswer,
  onSubmit,
  revealedLetters,
  correctAnswerForHint
}) {
  const getBackgroundColor = () => {
    if (!feedback) return FEEDBACK_COLORS.DEFAULT;
    
    switch (feedback.type) {
      case 'correct':
        return FEEDBACK_COLORS.GREEN;
      case 'related':
        return FEEDBACK_COLORS.YELLOW;
      case 'incorrect':
        return FEEDBACK_COLORS.RED;
      case 'prefix_missing':
        return FEEDBACK_COLORS.BLUE;
      default:
        return FEEDBACK_COLORS.DEFAULT;
    }
  };

  const getTextColor = () => {
    if (!feedback) return '#333333';
    return feedback.type === 'correct' || feedback.type === 'prefix_missing' 
      ? '#FFFFFF' 
      : '#333333';
  };

  const getBorderColor = () => {
    if (!feedback) return '#E0E0E0';
    return getBackgroundColor();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: feedback ? 3 : 1
        }
      ]}>
        {isLocked ? (
          <Text style={[styles.lockedText, { color: getTextColor() }]}>
            {correctAnswer || value}
          </Text>
        ) : (
          <TextInput
            style={[styles.input, { color: getTextColor() }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLocked}
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            blurOnSubmit={false}
            clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : undefined}
            textContentType="none"
          />
        )}
      </View>
      {revealedLetters && revealedLetters.length > 0 && !value && correctAnswerForHint && (
        <Text style={styles.hintText}>
          Hint: {Array.from({ length: correctAnswerForHint.length }, (_, i) => 
            revealedLetters.includes(i) ? correctAnswerForHint[i] : '_'
          ).join(' ')}
        </Text>
      )}
      {feedback && feedback.message && (
        <Text style={[styles.feedbackText, { color: getBorderColor() }]}>
          {feedback.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: IS_SMALL_SCREEN ? 6 : 8,
    minWidth: IS_SMALL_SCREEN ? 100 : 120,
    maxWidth: IS_SMALL_SCREEN ? '48%' : undefined,
  },
  label: {
    fontSize: IS_SMALL_SCREEN ? 11 : 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 8,
    padding: IS_SMALL_SCREEN ? 10 : 12,
    minHeight: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    fontSize: IS_SMALL_SCREEN ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 0,
    minHeight: 24, // Ensure text is visible
  },
  lockedText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'monospace',
  },
  feedbackText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

