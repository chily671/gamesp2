import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    sessionCodeHash: { type: String, required: true, unique: true, immutable: true },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
    },
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CharacterProfile",
      required: true,
      immutable: true,
    },
    characterSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
    gameVersion: {
      type: String,
      enum: ["legacy-v1", "rpg-v2", "quiz-v3"],
      default: "legacy-v1",
      immutable: true,
    },
    quizProgress: {
      currentQuestionIndex: { type: Number, min: 0, max: 1000 },
      questionCount: { type: Number, min: 1, max: 1000 },
      questionSnapshots: {
        type: [mongoose.Schema.Types.Mixed],
        default: undefined,
      },
      answers: {
        type: [
          new mongoose.Schema(
            {
              questionCode: { type: String, required: true },
              choice: { type: [String], required: true },
              isCorrect: { type: Boolean, required: true },
              points: { type: Number, required: true, min: 0 },
              answeredAt: { type: Date, required: true },
            },
            { _id: false },
          ),
        ],
        default: undefined,
      },
    },
    rpgProgress: {
      currentStage: { type: Number, min: 1, max: 3 },
      dataRisk: { type: Number, min: 0, max: 100 },
      protectionScore: { type: Number, min: 0, max: 100 },
      evidenceInventory: { type: [String], default: undefined },
      discoveredInteractables: { type: [String], default: undefined },
      storyFlags: { type: [String], default: undefined },
      decisions: {
        type: [
          new mongoose.Schema(
            {
              stage: { type: Number, required: true, min: 1, max: 3 },
              actionId: { type: String, required: true },
              dataRiskDelta: { type: Number, required: true },
              protectionDelta: { type: Number, required: true },
              evidenceIds: { type: [String], default: [] },
              decidedAt: { type: Date, required: true },
            },
            { _id: false },
          ),
        ],
        default: undefined,
      },
      endingId: { type: String, default: undefined },
    },
    status: {
      type: String,
      enum: ["registered", "in_progress", "completed", "expired"],
      default: "registered",
    },
    currentStage: { type: Number, min: 0, max: 4, default: 0 },
    score: { type: Number, min: 0, default: 0 },
    answers: {
      type: [
        new mongoose.Schema(
          {
            stage: { type: Number, required: true, min: 1, max: 4 },
            choice: { type: mongoose.Schema.Types.Mixed, required: true },
            isCorrect: { type: Boolean, required: true },
            points: { type: Number, required: true, min: 0 },
            answeredAt: { type: Date, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    startedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, default: null },
    duration: { type: Number, min: 0, default: null },
    expiresAt: { type: Date, required: true },
    retentionExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

gameSessionSchema.index({ retentionExpiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.GameSession ||
  mongoose.model("GameSession", gameSessionSchema);
