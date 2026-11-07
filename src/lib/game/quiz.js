import { randomInt } from "node:crypto";

export const DEFAULT_QUIZ_QUESTION_COUNT = 4;

export function selectRandomQuizQuestions(questions, questionCount) {
  if (
    !Array.isArray(questions) ||
    !Number.isInteger(questionCount) ||
    questionCount < 1 ||
    questionCount > questions.length
  ) {
    throw new Error("Cannot select the configured number of quiz questions.");
  }

  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, questionCount).map((question) => ({
    questionCode: question.questionCode,
    title: question.title,
    story: question.story,
    scenario: question.scenario,
    interactionPrompt: question.interactionPrompt,
    answerMode: question.answerMode,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      detail: option.detail,
    })),
    correctAnswer: [...question.correctAnswer],
    explanation: question.explanation,
    lesson: question.lesson,
    legalArticles: [...question.legalArticles],
    legalBasis: question.legalBasis,
    legalReviewRequired: question.legalReviewRequired,
  }));
}

export function getPublicQuizQuestion(question, characterName) {
  const replaceName = (text) =>
    text.replaceAll("{characterName}", characterName ?? "người chơi");

  return {
    questionCode: question.questionCode,
    title: question.title,
    story: replaceName(question.story),
    scenario: replaceName(question.scenario),
    interactionPrompt: replaceName(question.interactionPrompt),
    answerMode: question.answerMode,
    options: question.options,
  };
}
