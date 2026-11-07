const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const questions = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "seed", "quiz-questions.json"),
    "utf8",
  ),
);

async function seedQuestions() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Set it before seeding questions.");
  }

  if (
    questions.length !== 20 ||
    new Set(questions.map((question) => question.questionCode)).size !== 20 ||
    questions.some(
      (question) =>
        !Array.isArray(question.legalArticles) ||
        question.legalArticles.length === 0 ||
        question.legalReviewRequired !== true ||
        question.options.length < 2 ||
        question.correctAnswer.length === 0,
    )
  ) {
    throw new Error("Quiz question seed data failed its integrity checks.");
  }

  await mongoose.connect(mongoUri);
  const collectionName = mongoose.pluralize()("QuizQuestion");
  const operations = questions.map((question) => ({
    updateOne: {
      filter: { questionCode: question.questionCode },
      update: { $setOnInsert: question },
      upsert: true,
    },
  }));
  const result = await mongoose.connection
    .collection(collectionName)
    .bulkWrite(operations, { ordered: true });

  console.log(
    `Quiz question seed complete: ${result.upsertedCount} inserted, ${result.matchedCount} already present.`,
  );
}

seedQuestions()
  .catch((error) => {
    console.error("Quiz question seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
