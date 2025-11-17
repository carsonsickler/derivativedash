const FEEDBACK_COLORS = {
  correct: '#22c55e',
  related: '#facc15',
  incorrect: '#f87171',
  prefix_missing: '#38bdf8',
  default: '#ffffff'
};

export default function WordInputCell({
  label,
  value,
  onChange,
  placeholder,
  feedback,
  disabled,
  correctAnswer,
  revealedLetters,
  onSubmit
}) {
  const background = feedback ? FEEDBACK_COLORS[feedback.type] : FEEDBACK_COLORS.default;

  const hint =
    revealedLetters && revealedLetters.length > 0 && !value && correctAnswer
      ? Array.from({ length: correctAnswer.length }, (_, i) =>
          revealedLetters.includes(i) ? correctAnswer[i] : '_'
        ).join(' ')
      : null;

  return (
    <div className="cell">
      <p className="cell-label">{label}</p>
      {disabled ? (
        <div className="cell-locked" style={{ backgroundColor: background }}>
          {correctAnswer || value}
        </div>
      ) : (
        <input
          className="cell-input"
          style={{ backgroundColor: background }}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
        />
      )}
      {hint && <p className="cell-hint">Hint: {hint}</p>}
      {feedback?.message && (
        <p className="cell-feedback" style={{ color: background === FEEDBACK_COLORS.default ? '#6b7280' : '#1f2933' }}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}

