import mongoose from "mongoose";

const quizQuestionOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const quizQuestionSchema = new mongoose.Schema(
  {
    questionCode: { type: String, required: true, unique: true, immutable: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    scenario: { type: String, required: true },
    interactionPrompt: { type: String, required: true },
    answerMode: {
      type: String,
      enum: ["single", "multiple"],
      default: "single",
      required: true,
    },
    options: { type: [quizQuestionOptionSchema], required: true },
    correctAnswer: { type: [String], required: true, select: false },
    explanation: { type: String, required: true },
    lesson: { type: String, required: true },
    legalArticles: {
      type: [{ type: Number, enum: [3, 4, 7, 9, 10, 12, 16, 19] }],
      required: true,
    },
    legalBasis: { type: String, required: true },
    legalReviewRequired: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

quizQuestionSchema.index({ isActive: 1, questionCode: 1 });

export default mongoose.models.QuizQuestion ||
  mongoose.model("QuizQuestion", quizQuestionSchema);
