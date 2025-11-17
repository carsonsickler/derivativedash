# Derivation Dash (Web)

Derivation Dash is a web-based word formation game inspired by the Cambridge FCE/CAE exam. Complete word families by providing the noun, verb, adjective, and adverb derived from a single root.

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

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) for fast development and builds
- Pure CSS (no UI frameworks)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
/
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── GameBoard.jsx
│   │   └── WordInputCell.jsx
│   ├── data/
│   │   └── wordFamilies.js
│   ├── main.jsx
│   └── styles.css
├── package.json
├── vite.config.js
└── render.yaml                # (optional) Render static hosting config
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

Add or modify word families in `src/data/wordFamilies.js`:

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

## Deploying to Render

Use the included `render.yaml` or set:

- **Service type:** Static
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`

## License

MIT


