import mongoose from "mongoose";

const missionOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const missionSchema = new mongoose.Schema(
  {
    missionCode: { type: String, required: true, unique: true, immutable: true },
    stage: { type: Number, required: true, min: 1, max: 4, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    story: { type: String, required: true },
    scenario: { type: String, required: true },
    interactionType: {
      type: String,
      enum: ["permissions", "data-review", "chat", "final-plan"],
      required: true,
    },
    answerMode: {
      type: String,
      enum: ["single", "multiple"],
      default: "multiple",
      required: true,
    },
    interactionPrompt: { type: String, required: true },
    options: { type: [missionOptionSchema], required: true },
    correctAnswer: { type: [String], required: true, select: false },
    explanation: { type: String, required: true },
    lesson: { type: String, required: true },
    legalBasis: { type: String, required: true },
    legalReviewRequired: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Mission || mongoose.model("Mission", missionSchema);
