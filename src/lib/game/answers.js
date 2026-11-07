export function isValidAnswerChoice(choice, options, answerMode) {
  return (
    Array.isArray(choice) &&
    choice.length > 0 &&
    choice.length <= options.length &&
    (answerMode !== "single" || choice.length === 1) &&
    choice.every((item) => typeof item === "string") &&
    new Set(choice).size === choice.length &&
    choice.every((item) => options.some((option) => option.id === item))
  );
}

export function calculateAnswerPoints(choice, expected, answerMode) {
  const expectedSet = new Set(expected);
  if (answerMode === "single") {
    return choice.length === 1 && expectedSet.has(choice[0]) ? 100 : 0;
  }
  const correctCount = choice.filter((item) => expectedSet.has(item)).length;
  const incorrectCount = choice.length - correctCount;
  return Math.max(
    0,
    Math.round((80 * correctCount) / expected.length) -
      10 * incorrectCount +
      (incorrectCount === 0 && correctCount === expected.length ? 20 : 0),
  );
}
