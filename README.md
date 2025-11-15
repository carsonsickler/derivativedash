# Derivation Dash

A React Native word formation game where players complete word families by deriving Noun, Verb, Adjective, and Adverb from a single root word. Designed for FCE/CAE exam preparation.

## Features

- 4-column grid (Noun, Verb, Adjective, Adverb)
- One word pre-filled, player fills the other 3
- Color-coded feedback system:
  - **Green**: Correct word and part of speech
  - **Yellow**: Related word but wrong form or column
  - **Red**: Incorrect derivation
  - **Blue**: Prefix missing (Level 3)
- Three difficulty levels targeting FCE/CAE exam requirements
- Round-based gameplay with scoring
- Hint system

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `w` for web
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
games/
├── App.js                      # Main app component
├── components/
│   ├── GameBoard.js           # Main game logic and board
│   └── WordInputCell.js       # Input cell with feedback
├── data/
│   └── wordFamilies.js        # Word families by difficulty level
├── package.json
├── app.json                   # Expo configuration
└── README.md
```

## How to Play

1. Select a difficulty level (Level 1, 2, or 3)
2. You'll see a 4-column grid with one word pre-filled
3. Fill in the three empty fields with the correct derived forms
4. Tap "Check" to validate your answers
5. Receive color-coded feedback for each answer
6. Win the round by getting all three correct
7. Continue to the next round to improve your score

## Difficulty Levels

### Level 1: Basic Suffixes (FCE-style)
- Common, predictable suffixes
- Regular spelling changes
- Examples: beauty → beautiful → beautifully

### Level 2: Irregular/Multiple Forms (Advanced FCE/CAE)
- Significant spelling changes (dropping letters, double consonants)
- Multiple valid forms
- Examples: apply → application (Y to I), strong → strength

### Level 3: Negation and Prefix Challenges (CAE-style)
- Requires negative prefixes (un-, dis-, il-, im-)
- Focuses on common exam trick questions
- Examples: patient → impatient, possible → impossible

## Customization

To add your own word families, edit `data/wordFamilies.js`:

```javascript
{
  noun: 'NOUN_FORM',
  verb: 'VERB_FORM',
  adjective: 'ADJECTIVE_FORM',
  adverb: 'ADVERB_FORM',
  root: 'root_word',
  note: 'Optional note about the derivation',
  requiresPrefix: 'adjective' // For Level 3
}
```

## License

MIT


