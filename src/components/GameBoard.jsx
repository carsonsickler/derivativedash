import { useState, useEffect, useCallback } from 'react';
import WordInputCell from './WordInputCell.jsx';
import { WORD_FAMILIES, isRelatedWord } from '../data/wordFamilies.js';

const PARTS_OF_SPEECH = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB'];
const PART_KEYS = ['noun', 'verb', 'adjective', 'adverb'];

const FEEDBACK_BADGES = [
  { label: 'Green: Correct', color: '#22c55e' },
  { label: 'Yellow: Related / Wrong Column', color: '#facc15' },
  { label: 'Red: Incorrect', color: '#f87171' },
  { label: 'Blue: Prefix Missing', color: '#38bdf8' }
];

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
  }, [difficulty, currentFamily, startNewRound]);

  const startNewRound = useCallback(() => {
    const families = WORD_FAMILIES[difficulty];
    const randomFamily = families[Math.floor(Math.random() * families.length)];
    setCurrentFamily(randomFamily);
    setInputs({ noun: '', verb: '', adjective: '', adverb: '' });
    setFeedback({});
    setGameWon(false);
    setRevealedLetters({ noun: [], verb: [], adjective: [], adverb: [] });
  }, [difficulty]);

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
    setInputs((prev) => ({ ...prev, [part]: value.toUpperCase() }));
    setFeedback((prev) => {
      const updated = { ...prev };
      delete updated[part];
      return updated;
    });
  };

  const handleCheck = () => {
    if (gameWon) return;
    const emptyFields = PART_KEYS.filter((key) => !inputs[key].trim());
    if (emptyFields.length > 0) {
      window.alert('Please fill in all four fields before checking.');
      return;
    }

    const newFeedback = {};
    let allCorrect = true;

    PART_KEYS.forEach((key, index) => {
      const answer = inputs[key].trim().toUpperCase();
      const correct = currentFamily[key].toUpperCase();
      const part = PARTS_OF_SPEECH[index];

      if (answer === correct) {
        newFeedback[key] = { type: 'correct', message: 'Perfect!' };
      } else {
        allCorrect = false;
        if (isRelatedWord(answer, currentFamily)) {
          const belongsElsewhere = PART_KEYS.some(
            (otherKey, otherIdx) => otherIdx !== index && currentFamily[otherKey].toUpperCase() === answer
          );
          newFeedback[key] = {
            type: 'related',
            message: belongsElsewhere
              ? 'This belongs to another column.'
              : `Valid derivation, but not the main ${part.toLowerCase()}.`
          };
        } else if (difficulty === 'level3' && currentFamily.requiresPrefix) {
          const root = currentFamily.root.toUpperCase();
          if (answer.includes(root) || root.includes(answer)) {
            newFeedback[key] = {
              type: 'prefix_missing',
              message: 'This needs a negative prefix (un-, dis-, il-, im-).'
            };
          } else {
            newFeedback[key] = { type: 'incorrect', message: 'Not a valid derivation.' };
          }
        } else {
          newFeedback[key] = { type: 'incorrect', message: 'Not a valid derivation.' };
        }
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setGameWon(true);
      setScore((prev) => prev + 1);
      window.alert('Excellent! You completed the word family.');
    }
  };

  const handleReset = () => {
    setInputs({ noun: '', verb: '', adjective: '', adverb: '' });
    setFeedback({});
    setGameWon(false);
    setRevealedLetters({ noun: [], verb: [], adjective: [], adverb: [] });
  };

  const handleHint = () => {
    if (!currentFamily) return;
    const incomplete = PART_KEYS.filter(
      (key) => inputs[key].trim().toUpperCase() !== currentFamily[key].toUpperCase()
    );
    if (incomplete.length === 0) return;
    const hintField = incomplete[Math.floor(Math.random() * incomplete.length)];
    const correctAnswer = currentFamily[hintField].toUpperCase();
    const revealed = revealedLetters[hintField] || [];
    const remaining = [];
    for (let i = 0; i < correctAnswer.length; i += 1) {
      if (!revealed.includes(i)) remaining.push(i);
    }
    if (remaining.length === 0) return;
    const indexToReveal = remaining[Math.floor(Math.random() * remaining.length)];
    setRevealedLetters((prev) => ({
      ...prev,
      [hintField]: [...prev[hintField], indexToReveal]
    }));
  };

  const handleNext = () => {
    setRound((prev) => prev + 1);
    startNewRound();
  };

  if (!difficulty) {
    return (
      <div className="game-container">
        <div className="card">
          <div className="header">
            <h1 className="title">Derivation Dash</h1>
            <p className="subtitle">Choose your challenge level to begin.</p>
          </div>
          <div className="difficulty-panel">
            <button className="btn btn-check" onClick={() => setDifficulty('level1')}>
              Level 1 · Basic Suffixes
            </button>
            <button className="btn btn-hint" onClick={() => setDifficulty('level2')}>
              Level 2 · Tricky Transformations
            </button>
            <button className="btn btn-next" onClick={() => setDifficulty('level3')}>
              Level 3 · Negatives & Prefixes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentFamily) return null;

  return (
    <div className="game-container">
      <div className="card">
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button className="btn btn-back" onClick={handleBack}>
              ← Back
            </button>
          </div>
          <h1 className="title">Derivation Dash</h1>
          <p className="subtitle">
            Round {round} · Score {score}
          </p>
          <p className="instruction">Fill in all four forms of the word family.</p>
        </div>

        <div className="root-display">
          <p className="subtitle">Root Word</p>
          <span className="root-chip">{currentFamily.root.toUpperCase()}</span>
        </div>

        <div className="grid">
          {PARTS_OF_SPEECH.map((part, index) => {
            const key = PART_KEYS[index];
            return (
              <WordInputCell
                key={key}
                label={part}
                value={inputs[key]}
                onChange={(value) => handleInputChange(key, value)}
                placeholder={`Enter ${part.toLowerCase()}`}
                feedback={feedback[key]}
                disabled={gameWon}
                correctAnswer={gameWon ? currentFamily[key] : null}
                revealedLetters={revealedLetters[key] || []}
                onSubmit={handleCheck}
              />
            );
          })}
        </div>

        <div className="legend">
          <p className="subtitle" style={{ marginBottom: 0 }}>
            Feedback Colors
          </p>
          <div className="legend-items">
            {FEEDBACK_BADGES.map((badge) => (
              <div key={badge.label} className="legend-item" style={{ background: badge.color }}>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-check" onClick={handleCheck} disabled={gameWon}>
            Check
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-hint" onClick={handleHint}>
            Hint
          </button>
          <button className="btn btn-next" onClick={handleNext}>
            Next
          </button>
        </div>

        {currentFamily.note && <div className="note">💡 {currentFamily.note}</div>}
      </div>
    </div>
  );
}

